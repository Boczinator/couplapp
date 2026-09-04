import { ApiProperty } from '@nestjs/swagger'
import { ProfileDto } from 'src/profiles/dtos/profile.dto'

export class FriendRequestDto {
	@ApiProperty({ enum: ['pending', 'accepted', 'blocked'], example: 'pending' })
	status!: 'pending' | 'accepted' | 'blocked'

	@ApiProperty({
		example: 'incoming',
		description: 'Direction of the request (e.g., incoming or outgoing)',
	})
	direction!: string

	@ApiProperty({ type: () => ProfileDto })
	profile!: ProfileDto
}
