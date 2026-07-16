import { IsNotEmpty, IsString } from 'class-validator'

export class CreateProfileDto {
	@IsString()
	picture!: string | null

	@IsString()
	bannerPicture!: string | null

	@IsString()
	bio!: string | null

	@IsString()
	location!: string | null
}
