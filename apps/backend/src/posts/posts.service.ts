import {
	ForbiddenException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { and, desc, eq, or, sql } from 'drizzle-orm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { FeedService } from 'src/feed/feed.service'
import { LikesService } from 'src/likes/likes.service'

@Injectable()
export class PostsService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly feedService: FeedService,
		private readonly likesService: LikesService,
	) {}

	async getPostsByProfile({
		profileId,
		activeProfileId,
	}: {
		profileId: string
		activeProfileId: string
	}) {
		const posts = await this.db.query.posts.findMany({
			where: or(
				eq(schema.posts.profileId, profileId),
				eq(schema.posts.receiverId, profileId),
			),
			orderBy: desc(schema.posts.createdAt),
			with: {
				author: true,
				receiver: true,
			},
			extras: {
				likesCount: sql<number>`(
					SELECT count(*)::int 
					FROM likes 
					WHERE likes.post_id = posts.id
				)`.as('likes_count'),

				isLiked: sql<boolean>`(
					SELECT EXISTS (
						SELECT 1 
						FROM likes 
						WHERE likes.post_id = posts.id 
						AND likes.profile_id = ${activeProfileId}
					)
				)`.as('is_liked'),
			},
		})

		return {
			posts,
			isOwner: profileId === activeProfileId,
		}
	}

	async createPost({
		profileId,
		post,
	}: {
		profileId: string
		post: CreatePostDto
	}) {
		const [createdPost] = await this.db
			.insert(schema.posts)
			.values({
				text: post.text,
				receiverId: post.receiverId,
				profileId,
			})
			.returning()

		if (!createdPost) {
			throw new InternalServerErrorException('Posts couldn´t be created')
		}

		await this.feedService.fanOutPost({
			authorId: profileId,
			postId: createdPost.id,
		})

		return createdPost
	}

	async removePost({
		profileId,
		postId,
	}: {
		profileId: string
		postId: string
	}) {
		const [removedPost] = await this.db
			.delete(schema.posts)
			.where(
				and(eq(schema.posts.id, postId), eq(schema.posts.profileId, profileId)),
			)
			.returning()

		if (!removedPost) {
			throw new InternalServerErrorException(
				`Post with id ${postId} couldn´t be removed`,
			)
		}

		return {
			success: true,
		}
	}

	async updatePost({
		postId,
		post,
		profileId,
	}: {
		postId: string
		post: UpdatePostDto
		profileId: string
	}) {
		const oldPost = await this.db.query.posts.findFirst({
			where: eq(schema.posts.id, postId),
		})

		if (!oldPost) {
			throw new NotFoundException(`Post with given id not found`)
		}

		if (oldPost.profileId !== profileId) {
			throw new ForbiddenException('Access forbidden on given post')
		}

		const updatedPost = await this.db
			.update(schema.posts)
			.set({
				...post,
				updatedAt: new Date(),
			})
			.where(eq(schema.posts.id, postId))
			.returning()

		if (!updatedPost) {
			throw new InternalServerErrorException(`Failed to update post ${postId}`)
		}

		return updatedPost
	}

	async handlePostLikeToggle({
		activeProfileId,
		postId,
	}: {
		activeProfileId: string
		postId: string
	}) {
		const postExists = await this.db.query.posts.findFirst({
			where: eq(schema.posts.id, postId),
		})

		if (!postExists)
			throw new NotFoundException(`Post with id ${postId} not found`)

		const { isLiked, likesCountDelta } =
			await this.likesService.toggleLikeOnPost({
				activeProfileId,
				postId,
			})

		return {
			postId,
			isLiked,
			likesCountDelta,
		}
	}
}
