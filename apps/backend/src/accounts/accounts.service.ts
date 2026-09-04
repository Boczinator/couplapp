import { Inject, Injectable } from '@nestjs/common'
import * as schema from '../db/schema'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UsersService } from 'src/users/users.service'
import { ProfilesService } from 'src/profiles/profiles.service'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import { AuthService } from 'src/auth/auth.service'
import type { Response } from 'express'
import { CreateProfileDto } from 'src/profiles/dtos/create-profile.dto'

@Injectable()
export class AccountsService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly usersService: UsersService,
		private readonly profileService: ProfilesService,
		private readonly authService: AuthService,
	) {}

	async register(createUserDto: CreateUserDto) {
		return await this.db.transaction(async (tx) => {
			const newUser = await this.usersService.create(createUserDto, tx)

			await this.profileService.create(
				{
					name: `${newUser.firstName} ${newUser.lastName}`,
					bio: null,
					picture: null,
					bannerPicture: null,
					location: null,
					isPrivate: newUser.isPrivate,
				},
				newUser.id,
				tx,
			)

			return newUser
		})
	}

	async switchProfileAndTokens(
		userId: string,
		profileId: string,
		res: Response,
	) {
		const updatedProfile = await this.profileService.switchActiveProfile(
			userId,
			profileId,
		)

		await this.authService.generateTokens({
			userId: updatedProfile.userId,
			res,
			activeProfileId: updatedProfile.id,
		})

		return updatedProfile
	}

	async createProfileAndTokens(
		userId: string,
		profile: CreateProfileDto,
		res: Response,
	) {
		const createdProfile = await this.profileService.create(profile, userId)

		await this.authService.generateTokens({
			userId: createdProfile.userId,
			res,
			activeProfileId: createdProfile.id,
		})

		return createdProfile
	}
}
