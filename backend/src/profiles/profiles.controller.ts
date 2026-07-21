import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common'
import { CreateProfileDto } from './dtos/create-profile.dto'
import { ProfilesService } from './profiles.service'
import * as schema from 'src/db/schema'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { AuthService } from 'src/auth/auth.service'
import type { Response } from 'express'

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
	constructor(
		private readonly profileService: ProfilesService,
		private readonly authService: AuthService,
	) {}

	@Get('search')
	async search(@Query('query') query: string) {
		const result = await this.profileService.search(query)

		return result
	}

	@Get('overview')
	async getLight(@Req() req: Request & { user: { id: string } }) {
		const updatedProfile = await this.profileService.findAllLight(req.user.id)

		return updatedProfile
	}

	@Get(':id')
	async getById(
		@Param('id') id: schema.Profile['id'],
		@Req() req: Request & { user: { id: string } },
	) {
		const profile = await this.profileService.findOne(id, req.user.id)

		return profile
	}

	@Post()
	async create(
		@Req() req: Request & { user: { id: string } },
		@Res({ passthrough: true }) res: Response,
		@Body() profile: CreateProfileDto,
	) {
		const newProfile = await this.profileService.create(profile, req.user.id)

		await this.authService.generateTokens({
			userId: newProfile.userId,
			res,
			activeProfileId: newProfile.id,
		})

		return newProfile
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Req() req: Request & { user: { id: string } },
		@Body() profile: UpdateProfileDto,
	) {
		const updatedProfile = await this.profileService.update(
			id,
			req.user.id,
			profile,
		)

		return updatedProfile
	}

	@Patch('switch/:id')
	async switchProfile(
		@Param('id') id: string,
		@Req() req: Request & { user: { id: string } },
		@Res({ passthrough: true }) res: Response,
	) {
		const updatedProfile = await this.profileService.switchActiveProfile(
			req.user.id,
			id,
		)

		await this.authService.generateTokens({
			userId: updatedProfile.userId,
			res,
			activeProfileId: updatedProfile.id,
		})

		return updatedProfile
	}
}
