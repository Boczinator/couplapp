import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { and, asc, desc, eq } from 'drizzle-orm'
import { CreatePostDto } from './dto/create-post.dto'

@Injectable()
export class PostsService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async getPostsByProfile({
		profileId,
		activeProfileId,
	}: {
		profileId: string
		activeProfileId: string
	}) {
		const posts = await this.db.query.posts.findMany({
			where: eq(schema.posts.profileId, profileId),
			orderBy: desc(schema.posts.createdAt),
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
				profileId,
			})
			.returning()

		if (!createdPost) {
			throw new InternalServerErrorException('Posts couldn´t be created')
		}

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
}
