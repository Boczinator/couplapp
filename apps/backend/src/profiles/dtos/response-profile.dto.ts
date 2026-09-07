import { ApiProperty, PickType } from '@nestjs/swagger'
import { ProfileDto } from './profile.dto'
import { FriendshipStatusDto } from 'src/friends/dto/response-friendship.dto'

export class LightProfileResponseDto extends PickType(ProfileDto, [
	'id',
	'name',
	'picture',
] as const) {}

export class ProfileResponseDto extends ProfileDto {
	@ApiProperty() isOwner!: boolean
	@ApiProperty({ type: FriendshipStatusDto, required: false, nullable: true })
	friendship?: FriendshipStatusDto | null

	@ApiProperty({ type: [ProfileDto], required: false })
	friends?: Pick<ProfileDto, 'id' | 'name' | 'picture'>[]
}
