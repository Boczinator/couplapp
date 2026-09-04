import { PickType } from '@nestjs/swagger'
import { ProfileDto } from './profile.dto'

export class CreateProfileDto extends PickType(ProfileDto, [
	'name',
	'bio',
	'picture',
	'bannerPicture',
	'location',
	'isPrivate',
]) {}
