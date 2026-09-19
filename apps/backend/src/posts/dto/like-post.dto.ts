import { ApiProperty } from '@nestjs/swagger'

export class LikeToggleResponseDto {
	@ApiProperty({
		description: 'The unique UUID identifier of the targeted post',
		example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
		format: 'uuid',
		type: String,
	})
	postId!: string

	@ApiProperty({
		description:
			'Indicates the final interaction state. Returns true if the post is now liked by the user, and false if unliked.',
		example: true,
		type: Boolean,
	})
	isLiked!: boolean

	@ApiProperty({
		description:
			'The numeric delta value to apply to your local client UI counter. Returns 1 for an added like, and -1 for a removed like.',
		example: 1,
		enum: [1, -1],
		type: Number,
	})
	likesCountDelta!: number
}
