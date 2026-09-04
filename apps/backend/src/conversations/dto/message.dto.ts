import { ApiProperty, PickType } from '@nestjs/swagger'
import { ProfileDto } from 'src/profiles/dtos/profile.dto'

export class MessageSenderDto extends PickType(ProfileDto, ['id', 'picture']) {}

export class ChatMessageDto {
	@ApiProperty({ example: 'c91c9d0-6dfd-4ffe-a07d-b26d1024f883' })
	id!: string

	@ApiProperty({ example: '2026-08-06T06:52:20.204Z' })
	createdAt!: Date

	@ApiProperty({ example: 'prof_8c91c9d0' })
	senderId!: string

	@ApiProperty({ type: String, example: 'conv_12345', nullable: true })
	conversationId!: string | null

	@ApiProperty({ type: String, example: 'Hey there!', nullable: true })
	content!: string | null

	@ApiProperty({ type: Boolean, example: false, nullable: true })
	isRead!: boolean | null

	@ApiProperty({
		type: Date,
		example: '2026-08-06T06:55:00.000Z',
		nullable: true,
	})
	readAt!: Date | null
}

export class ChatMessageWithSenderDto extends ChatMessageDto {
	@ApiProperty({ type: () => MessageSenderDto })
	sender!: MessageSenderDto
}
