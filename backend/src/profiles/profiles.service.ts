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

			return profiles
		} catch (error) {
			throw new InternalServerErrorException({ cause: error })
		}
	}

	async findOne(id: schema.Profile['id']) {
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

		return userProfile
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

	async update(profile: UpdateProfileDto) {
		let updatedProfile

		try {
			const { id, ...updateData } = profile

			;[updatedProfile] = await this.db
				.update(schema.profiles)
				.set({
					...updateData,
				})
				.where(eq(schema.profiles.id, id))
				.returning()
		} catch (error) {
			throw new InternalServerErrorException({
				cause: error,
			})
		}

		if (!updatedProfile) {
			throw new NotFoundException(`User profile ${profile.id} not found!`)
		}

		return updatedProfile
	}
}
