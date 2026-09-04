import { ApiProperty, PickType } from '@nestjs/swagger'
import { ProfileDto } from './profile.dto'

export class LightProfileResponseDto extends PickType(ProfileDto, [
	'id',
	'name',
	'picture',
] as const) {}

export class ProfileResponseDto extends ProfileDto {
	@ApiProperty() isOwner!: boolean
	@ApiProperty({ required: false, nullable: true }) friendship?: any

	@ApiProperty({ type: [ProfileDto], required: false })
	friends?: Pick<ProfileDto, 'id' | 'name' | 'picture'>[]
}
