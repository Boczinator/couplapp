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
import { eq } from 'drizzle-orm'
import { DbTransaction } from 'src/db/db.types'
import { and } from 'drizzle-orm'

@Injectable()
export class ProfilesService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
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

	async findOne(id: schema.Profile['id'], currentUserId: string) {
		let userProfile: schema.Profile

		try {
			;[userProfile] = await this.db
				.select()
				.from(schema.profiles)
				.where(eq(schema.profiles.id, id))
		} catch (error) {
			throw new InternalServerErrorException({
				cause: error,
			})
		}

		if (!userProfile) {
			throw new NotFoundException(`User profile with given Id ${id} not found`)
		}

		const isOwner = userProfile.userId === currentUserId

		return {
			...userProfile,
			isOwner,
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

			// TODO: Set created Profile always as isActive, build function to reuse in switchProfile and here.
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

	async getLastActiveProfileId(userId: string) {
		const profileId = await this.db
			.select({ id: schema.profiles.id })
			.from(schema.profiles)
			.where(
				and(
					eq(schema.profiles.userId, userId),
					eq(schema.profiles.isActive, true),
				),
			)

		return profileId
	}

	async switchActiveProfile(userId: string, profileId: string) {
		return await this.db.transaction(async (tx) => {
			await tx
				.update(schema.profiles)
				.set({ isActive: false })
				.where(
					and(
						eq(schema.profiles.userId, userId),
						eq(schema.profiles.isActive, true),
					),
				)

			const [activeProfile] = await tx
				.update(schema.profiles)
				.set({ isActive: true })
				.where(
					and(
						eq(schema.profiles.userId, userId),
						eq(schema.profiles.id, profileId),
					),
				)
				.returning()

			return activeProfile
		})
	}
}
