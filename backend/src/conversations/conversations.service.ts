import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { and, asc, desc, eq, inArray, isNull, ne } from 'drizzle-orm'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ConversationsService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,

		private readonly eventEmitter: EventEmitter2,
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
			with: {
				sender: {
					columns: {
						id: true,
						picture: true,
					},
				},
			},
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

			if (!activeConversationId && receiverId) {
				const existingConversation = await tx
					.select({ conversationId: schema.participants.conversationId })
					.from(schema.participants)
					.where(
						and(
							eq(schema.participants.profileId, receiverId),
							inArray(
								schema.participants.conversationId,
								tx
									.select({
										conversationId: schema.participants.conversationId,
									})
									.from(schema.participants)
									.where(eq(schema.participants.profileId, senderId)),
							),
						),
					)
					.limit(1)

				activeConversationId =
					existingConversation[0]?.conversationId ?? undefined
			}

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
						conversationId: activeConversationId,
						profileId: senderId as string,
					},
					{
						conversationId: activeConversationId,
						profileId: receiverId as string,
					},
				])
			}

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

			await tx
				.update(schema.conversations)
				.set({ updatedAt: new Date() })
				.where(eq(schema.conversations.id, activeConversationId))

			const sender = await tx.query.messages.findFirst({
				where: eq(schema.messages.senderId, senderId),
				with: {
					sender: {
						columns: {
							id: true,
							picture: true,
						},
					},
				},
			})

			return {
				...createdMessage,
				sender,
			}
		})
	}

	async markAsRead({
		conversationId,
		profileId,
	}: {
		conversationId: string
		profileId: string
	}) {
		await this.db
			.update(schema.messages)
			.set({ readAt: new Date() })
			.where(
				and(
					eq(schema.messages.conversationId, conversationId),
					ne(schema.messages.senderId, profileId),
					isNull(schema.messages.readAt),
				),
			)

		const eventPayload = { conversationId, profileId, markedAt: new Date() }

		this.eventEmitter.emit('chat.conversation_read', eventPayload)

		return eventPayload
	}
}
