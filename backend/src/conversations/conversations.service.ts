import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { and, asc, desc, eq } from 'drizzle-orm'

@Injectable()
export class ConversationsService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async getInbox(profileId: string) {
		const participants = await this.db.query.participants.findMany({
			where: (table) => eq(table.profileId, profileId),
			columns: { conversationId: true },
		})

		const conversationIds = participants
			.map((participant) => participant.conversationId)
			.filter((id) => id !== null)

		if (conversationIds.length === 0) return []

		return await this.db.query.conversations.findMany({
			where: (table, { inArray }) => inArray(table.id, conversationIds),
			orderBy: [desc(schema.conversations.updatedAt)],
			with: {
				messages: {
					orderBy: [desc(schema.messages.createdAt)],
					limit: 1,
				},
				participants: {
					with: {
						profile: true,
					},
				},
			},
		})
	}

	async getConversationDetails(conversationId: string) {
		return await this.db.query.conversations.findFirst({
			where: eq(schema.conversations.id, conversationId),
			with: {
				participants: {
					with: {
						profile: true,
					},
				},
			},
		})
	}

	async getConversationMessages(conversationId: string) {
		return await this.db.query.messages.findMany({
			where: eq(schema.messages.conversationId, conversationId),
			orderBy: asc(schema.messages.createdAt),
		})
	}

	async createMessage({
		senderId,
		receiverId,
		conversationId,
		content,
	}: {
		senderId: string
		receiverId?: string
		conversationId?: string
		content: string
	}) {
		if (!conversationId && !receiverId) {
			throw new BadRequestException(
				'Either conversationId or receiverId must be provided',
			)
		}
		return await this.db.transaction(async (tx) => {
			let activeConversationId = conversationId

			// 1. If no conversationId passed, check if a 1-on-1 conversation already exists between these users
			if (!activeConversationId && receiverId) {
				const existingConversation = await tx
					.select({ conversationId: schema.participants.conversationId })
					.from(schema.participants)
					.where(
						and(
							eq(
								schema.participants.conversationId,
								tx
									.select({
										conversationId: schema.participants.conversationId,
									})
									.from(schema.participants)
									.where(eq(schema.participants.profileId, senderId)),
							),
							eq(schema.participants.profileId, receiverId),
						),
					)
					.limit(1)

				activeConversationId =
					existingConversation[0]?.conversationId ?? undefined
			}

			// 2. If still no conversationId found, create a new conversation and add participants
			if (!activeConversationId) {
				const [newConversation] = await tx
					.insert(schema.conversations)
					.values({
						title: null,
						isGroupChat: false,
					})
					.returning({ id: schema.conversations.id })

				if (!newConversation?.id) {
					throw new InternalServerErrorException(
						'Failed to create conversation',
					)
				}

				activeConversationId = newConversation.id

				if (!senderId || !receiverId) {
					throw new Error('Sender ID und Receiver ID müssen angegeben werden.')
				}

				await tx.insert(schema.participants).values([
					{
						conversationId: activeConversationId, // Deine generierte Konversations-ID
						profileId: senderId as string,
					},
					{
						conversationId: activeConversationId,
						profileId: receiverId as string,
					},
				])
			}

			// 3. Create the message attached to the resolved conversation ID
			const [createdMessage] = await tx
				.insert(schema.messages)
				.values({
					senderId,
					conversationId: activeConversationId,
					content,
				})
				.returning()

			if (!createdMessage) {
				throw new InternalServerErrorException('Failed to create message')
			}

			// 4. Touch updated_at on the conversation record
			await tx
				.update(schema.conversations)
				.set({ updatedAt: new Date() })
				.where(eq(schema.conversations.id, activeConversationId))

			return createdMessage
		})
	}
}
