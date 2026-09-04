import {
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from 'src/db/schema'
import { CreateProfileDto } from './dtos/create-profile.dto'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { eq, sql } from 'drizzle-orm'
import { DbTransaction } from 'src/db/db.types'
import { and } from 'drizzle-orm'
import { FriendsService } from 'src/friends/friends.service'
import { GetProfileQueryDto } from './dtos/get-profile-query.dto'
import { randomUUID } from 'crypto'
import { FilesService } from 'src/files/files.service'
import { ConfigService } from '@nestjs/config'
import { ProfileResponse, PublicProfile } from './profiles.types'
// import { ProfileQueryResult } from './profiles.types'

@Injectable()
export class ProfilesService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly friendsService: FriendsService,
		private readonly filesService: FilesService,
		private readonly configService: ConfigService,
	) {}

	async findAllLight(userId: schema.Profile['userId']) {
		if (!userId) {
			return []
		}

		try {
			const profiles = await this.db
				.select({
					id: schema.profiles.id,
					name: schema.profiles.name,
					picture: schema.profiles.picture,
				})
				.from(schema.profiles)
				.where(eq(schema.profiles.userId, userId))
				.orderBy(schema.profiles.createdAt)

			return profiles
		} catch (error) {
			throw new InternalServerErrorException({ cause: error })
		}
	}

	async findOne(
		id: schema.Profile['id'],
		currentUserId: string,
		activeProfileId: string,
		query: GetProfileQueryDto,
	): Promise<ProfileResponse> {
		const data = await this.db.query.profiles.findFirst({
			where: eq(schema.profiles.id, id),
		})

		if (!data) {
			throw new NotFoundException(`User profile with given Id ${id} not found`)
		}

		const includeFriends = query.includes?.includes('friends')
		const isOwner = data.id === activeProfileId
		const isPrivate = data.isPrivate === true && !isOwner

		const [friendship, friends] = await Promise.all([
			activeProfileId
				? this.friendsService.getStatus(activeProfileId, data.id)
				: Promise.resolve(undefined),
			includeFriends && !isPrivate
				? this.friendsService.getAllFriends(id)
				: Promise.resolve(undefined),
		])

		if (isPrivate) {
			return {
				...data,
				isPrivate: true as const,
				isOwner,
				friendship,
			}
		}

		return {
			...data,
			isPrivate: false as const,
			isOwner,
			friendship,
			...(friends && {
				friends: friends.map((friend) => ({
					id: friend.id,
					name: friend.name,
					picture: friend.picture,
				})),
			}),
		}
	}

	async create(
		profile: CreateProfileDto,
		userId: schema.User['id'],
		tx?: DbTransaction,
	) {
		const client = tx || this.db

		try {
			const [newProfile] = await client
				.insert(schema.profiles)
				.values({
					...profile,
					userId,
				})
				.returning()

			return newProfile
		} catch (error) {
			throw new InternalServerErrorException({ cause: error })
		}
	}

	async update(id: string, userId: string, profile: UpdateProfileDto) {
		let updatedProfile

		try {
			;[updatedProfile] = await this.db
				.update(schema.profiles)
				.set({
					...profile,
				})
				.where(
					and(eq(schema.profiles.id, id), eq(schema.profiles.userId, userId)),
				)
				.returning()
		} catch (error) {
			throw new InternalServerErrorException({
				cause: error,
			})
		}

		if (!updatedProfile) {
			throw new NotFoundException(`User profile with Id ${id} not found!`)
		}

		return updatedProfile
	}

	async switchActiveProfile(userId: string, profileId: string) {
		return await this.db.transaction(async (tx) => {
			const exists = await tx.query.profiles.findFirst({
				where: and(
					eq(schema.profiles.userId, userId),
					eq(schema.profiles.id, profileId),
				),
			})

			if (!exists) {
				throw new NotFoundException(
					'No profile with this id found on given user id',
				)
			}

			return exists
		})
	}

	async search(query: string) {
		if (query === '') {
			return
		}

		const sanitizedQuery = `${query.trim()}:*`

		const results = await this.db
			.select({
				id: schema.profiles.id,
				name: schema.profiles.name,
				picture: schema.profiles.picture,
			})
			.from(schema.profiles)
			.where(
				sql`to_tsvector('english', ${schema.profiles.name}) @@ to_tsquery('english', ${sanitizedQuery})`,
			)

		return results
	}

	async updateAvatar(profileId: string, file: Express.Multer.File) {
		const uuid = randomUUID()
		const fileExtension = file.mimetype.split('/')[1]
		const publicDomain =
			this.configService.getOrThrow<string>('R2_PUBLIC_DOMAIN')
		const publicBucket = this.configService.getOrThrow<string>(
			'R2_BUCKET_NAME_PUBLIC',
		)

		const key = `profiles/${profileId}/avatar-${uuid}.${fileExtension}`

		const profile = await this.db.query.profiles.findFirst({
			where: () => eq(schema.profiles.id, profileId),
		})

		if (profile?.picture) {
			try {
				await this.filesService.removeFile({
					key: profile?.picture,
					isPrivate: false,
				})
			} catch (error) {
				console.error(`Failed to cleanup old avatar ${profile.picture}`)
			}
		}

		const result = await this.filesService.generateUrlAndUploadFile({
			file,
			key,
			isPrivate: false,
		})

		const publicUrl = `${publicDomain}/${publicBucket}/${key}`

		await this.db
			.update(schema.profiles)
			.set({ picture: publicUrl })
			.where(eq(schema.profiles.id, profileId))

		return result
	}
}
