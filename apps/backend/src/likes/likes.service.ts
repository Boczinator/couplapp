import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { and, eq } from 'drizzle-orm'

@Injectable()
export class LikesService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async toggleLikeOnPost({
		activeProfileId,
		postId,
	}: {
		activeProfileId: string
		postId: string
	}) {
		const insertResult = await this.db
			.insert(schema.likes)
			.values({
				profileId: activeProfileId,
				postId,
			})
			.onConflictDoNothing()
			.returning()

		if (insertResult.length > 0) {
			return {
				isLiked: true,
				likesCountDelta: 1,
			}
		}

		await this.db
			.delete(schema.likes)
			.where(
				and(
					eq(schema.likes.profileId, activeProfileId),
					eq(schema.likes.postId, postId),
				),
			)

		return {
			isLiked: false,
			likesCountDelta: -1,
		}
	}
}
