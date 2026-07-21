import { IsOptional, IsString } from 'class-validator'

export class CreateProfileDto {
	@IsString()
	name!: string

	@IsOptional()
	@IsString()
	picture!: string | null

	@IsOptional()
	@IsString()
	bannerPicture!: string | null

	@IsOptional()
	@IsString()
	bio!: string | null

	@IsOptional()
	@IsString()
	location!: string | null
}
