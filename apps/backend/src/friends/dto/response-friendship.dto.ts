import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class FriendshipStatusDto {
	@ApiProperty({
		description: 'The UUID of the first profile in the relationship',
		example: 'a0eebc99-9c0b-4ef8-bb6d-6bb23280a11',
	})
	@IsUUID()
	profileId1!: string

	@ApiProperty({
		description: 'The UUID of the second profile in the relationship',
		example: 'b1fcfdfs99-934b-4ef8-bb3-6wb9dd80a22',
	})
	@IsUUID()
	profileId2!: string

	@ApiProperty({
		description: 'The current status of the friendship connection',
		example: 'pending',
	})
	status!: 'pending' | 'blocked' | 'accepted'

	@ApiProperty({
		description: 'The UUID of the profile who performed the last state action',
		example: 'a0eegfd9-9c0b-4ef8-dsd6d-6gffd380a11',
	})
	@IsUUID()
	actionProfileId!: string
}
