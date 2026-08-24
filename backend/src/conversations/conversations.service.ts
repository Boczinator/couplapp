import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { desc, eq } from 'drizzle-orm'

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

		this.db.query.conversations.findMany({
			where: (table, { inArray }) => inArray(table.id, conversationIds),
			orderBy: [desc(schema.conversations.updatedAt)],
			with: {
				messages: {
					orderBy: [desc(schema.messages.createdAt)],
					limit: 1,
				},
			},
		})
	}

	async createMessage({
		senderId,
		conversationId,
		content,
	}: {
		senderId: string
		conversationId: string
		content: string
	}) {
		return await this.db.transaction(async (tx) => {
			const createdMessage = await tx
				.insert(schema.messages)
				.values({
					senderId,
					conversationId,
					content,
				})
				.returning()

			if (!createdMessage) {
				throw new InternalServerErrorException()
			}

			await tx
				.update(schema.conversations)
				.set({ updatedAt: new Date() })
				.where(eq(schema.conversations.id, conversationId))

			return {
				...createdMessage,
			}
		})
	}
}
