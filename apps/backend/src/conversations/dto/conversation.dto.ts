import { ApiProperty } from '@nestjs/swagger'
import { ProfileDto } from 'src/profiles/dtos/profile.dto'
import { ChatMessageDto } from './message.dto'

export class ConversationParticipantDto {
	@ApiProperty({ example: 'prof_8c91c9d0-6dfd-4ffe-a07d-b26d1024f883' })
	profileId!: string

	@ApiProperty({ example: 'conv_12345-6dfd-4ffe-a07d-b26d1024f883' })
	conversationId!: string

	@ApiProperty({ example: '2026-08-06T06:52:20.204Z', nullable: true })
	joinedAt!: Date | null

	@ApiProperty({ type: ProfileDto })
	profile!: ProfileDto
}

export class ConversationDto {
	@ApiProperty({ example: 'conv_12345-6dfd-4ffe-a07d-b26d1024f883' })
	id!: string

	@ApiProperty({ example: 'Project Group Chat', nullable: true })
	title!: string | null

	@ApiProperty({ example: false })
	isGroupChat!: boolean

	@ApiProperty({ example: '2026-08-06T06:52:20.204Z', nullable: true })
	createdAt!: Date | null

	@ApiProperty({ example: '2026-08-06T06:52:20.204Z', nullable: true })
	updatedAt!: Date | null

	@ApiProperty({ type: [ConversationParticipantDto] })
	participants!: ConversationParticipantDto[]
}

export class InboxConversationDto extends ConversationDto {
	@ApiProperty({ type: [ChatMessageDto] })
	messages!: ChatMessageDto[]
}
