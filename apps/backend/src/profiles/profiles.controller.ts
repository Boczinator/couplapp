import {
	Body,
	Controller,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
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
	) {
		const profile = await this.profileService.findOne(
			id,
			req.user.id,
			req.user.activeProfileId,
			query,
		)

		return profile
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
