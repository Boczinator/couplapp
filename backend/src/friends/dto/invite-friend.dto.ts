import { IsString } from 'class-validator'

export class InviteFriendDto {
	@IsString()
	receiverId!: string
}
