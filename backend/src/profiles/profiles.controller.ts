import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common'
import { CreateProfileDto } from './dtos/create-profile.dto'
import { ProfilesService } from './profiles.service'
import * as schema from 'src/db/schema'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { UpdateProfileDto } from './dtos/update-profile.dto'

@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profileService: ProfilesService) {}

	@UseGuards(JwtAuthGuard)
	@Get('overview')
	async getLight(@Req() req: Request & { user: { id: string } }) {
		const updatedProfile = await this.profileService.findAllLight(req.user.id)

		return updatedProfile
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getById(@Param('id') id: schema.Profile['id']) {
		const profile = await this.profileService.findOne(id)

		return profile
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(
		@Req() req: Request & { user: { id: string } },
		@Body() profile: CreateProfileDto,
	) {
		const newProfile = await this.profileService.create(profile, req.user.id)

		console.log(newProfile)
		return newProfile
	}

	@UseGuards(JwtAuthGuard)
	@Patch()
	async update(@Body() profile: UpdateProfileDto) {
		const updatedProfile = await this.profileService.update(profile)

		return updatedProfile
	}
}
