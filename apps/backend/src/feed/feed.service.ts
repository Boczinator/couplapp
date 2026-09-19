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
						likes: true,
					},
				},
			},
		})

		const posts = feed
			.map((feedItem) => {
				const post = feedItem.post
				if (!post) return null

				const { likes, ...postData } = post

				return {
					...postData,
					likesCount: likes.length,
					isLiked: likes.some((like) => like.profileId === currentProfileId),
				}
			})
			.filter(Boolean)

		return {
			posts,
		}
	}
}
