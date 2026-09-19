import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import { FriendsService } from 'src/friends/friends.service'
import { desc, eq, sql } from 'drizzle-orm'

@Injectable()
export class FeedService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly friendsService: FriendsService,
	) {}

	async fanOutPost({ authorId, postId }: { authorId: string; postId: string }) {
		const friendsProfiles = await this.friendsService.getAllFriends(authorId)

		const feedEntries = friendsProfiles.map((friendProfile) => ({
			profileId: friendProfile.id,
			postId,
		}))

		return await this.db.insert(schema.feedActivities).values(feedEntries)
	}

	async getFeed(currentProfileId: string) {
		const feed = await this.db.query.feedActivities.findMany({
			where: () => eq(schema.feedActivities.profileId, currentProfileId),
			orderBy: desc(schema.feedActivities.createdAt),
			with: {
				post: {
					with: {
						author: true,
						receiver: true,
					},
					extras: {
						likesCount: sql<number>`(
							SELECT count(*)::int 
							FROM likes 
							WHERE likes.post_id = "feedActivities_post".id
						)`.as('likes_count'),

						isLiked: sql<boolean>`(
							SELECT EXISTS (
								SELECT 1 
								FROM likes 
								WHERE likes.post_id = "feedActivities_post".id 
								AND likes.profile_id = ${currentProfileId}
							)
						)`.as('is_liked'),
					},
				},
			},
		})

		const posts = feed.map((feedItem) => feedItem.post)

		return {
			posts,
		}
	}
}
