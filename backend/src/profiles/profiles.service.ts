import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from 'src/db/schema'
import { CreateProfileDto } from './dtos/create-profile.dto'
import { profile } from 'console'

@Injectable()
export class ProfilesService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async create(profile: CreateProfileDto, userId: schema.User['id']) {
		try {
			const [newProfile] = await this.db
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
}
