import { IsString } from 'class-validator'

export class CreateProfileDto {
	@IsString()
	name!: string | null

	@IsString()
	picture!: string | null

	@IsString()
	bannerPicture!: string | null

	@IsString()
	bio!: string | null

	@IsString()
	location!: string | null
}
