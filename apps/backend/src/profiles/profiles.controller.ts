import {
	Body,
	Controller,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	Patch,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import * as schema from 'src/db/schema'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { GetProfileQueryDto } from './dtos/get-profile-query.dto'
import 'multer'
import { FileInterceptor } from '@nestjs/platform-express'
import { ProfileResponseDto } from './dtos/response-profile.dto'
import { ProfileResponse, PublicProfile } from './profiles.types'

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profileService: ProfilesService) {}

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
		@Req() req: Request & { user: { id: string; activeProfileId: string } },
		@Query() query: GetProfileQueryDto,
	): Promise<ProfileResponse> {
		const data = await this.profileService.findOne(
			id,
			req.user.id,
			req.user.activeProfileId,
			query,
		)

		if (!data) {
			throw new NotFoundException('Profile not found')
		}

		if (data.isPrivate === true) {
			return {
				isPrivate: true,
				isOwner: data.isOwner,
				friendship: data.friendship,
				profile: {
					id: data.profile.id,
					name: data.profile.name,
					picture: data.profile.picture,
				},
			}
		}

		const publicData = data as PublicProfile

		return {
			isPrivate: false,
			isOwner: publicData.isOwner,
			friendship: publicData.friendship,
			profile: {
				id: publicData.profile.id,
				userId: publicData.profile.userId,
				name: publicData.profile.name,
				picture: publicData.profile.picture,
				bannerPicture: publicData.profile.bannerPicture, // 🚀 No more compilation error!
				location: publicData.profile.location,
				bio: publicData.profile.bio,
				createdAt: publicData.profile.createdAt,
				updatedAt: publicData.profile.updatedAt,
			},
			...(publicData.friends && { friends: publicData.friends }),
		}
	}

	@Patch('avatar')
	@UseInterceptors(FileInterceptor('file'))
	async updateAvatar(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 100000000 }),
					new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
		@Req() req: any,
	) {
		return await this.profileService.updateAvatar(
			req.user.activeProfileId,
			file,
		)
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
}
