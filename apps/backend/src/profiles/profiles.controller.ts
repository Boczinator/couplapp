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
import {
	LightProfileResponseDto,
	ProfileResponseDto,
} from './dtos/response-profile.dto'
import { ApiOkResponse } from '@nestjs/swagger'

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
	@ApiOkResponse({
		type: LightProfileResponseDto,
		isArray: true,
		description: 'Returns a level-one flat array of light profile items.',
	})
	async getLight(@Req() req: Request & { user: { id: string } }) {
		const updatedProfile = await this.profileService.findAllLight(req.user.id)

		return updatedProfile
	}

	@Get(':id')
	@ApiOkResponse({ type: ProfileResponseDto })
	async getById(
		@Param('id') id: schema.Profile['id'],
		@Req() req: Request & { user: { id: string; activeProfileId: string } },
		@Query() query: GetProfileQueryDto,
	): Promise<ProfileResponseDto> {
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
				id: data.id,
				name: data.name,
				picture: data.picture || '',
			}
		}

		const publicData = data as ProfileResponseDto

		return {
			...publicData,
			isPrivate: false,
			isOwner: publicData.isOwner,
			friendship: publicData.friendship,
			id: publicData.id,
			name: publicData.name,
			picture: publicData.picture,
			bannerPicture: publicData.bannerPicture,
			location: publicData.location,
			bio: publicData.bio,
			createdAt: publicData.createdAt,
			updatedAt: publicData.updatedAt,
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
