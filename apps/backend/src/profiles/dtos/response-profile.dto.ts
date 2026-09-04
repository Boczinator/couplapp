import { ApiProperty } from '@nestjs/swagger'

export class FriendReferenceDto {
	@ApiProperty() id!: string
	@ApiProperty() name!: string
	@ApiProperty({ nullable: true }) picture!: string | null
}

export class ProfileResponseDto {
	@ApiProperty() isPrivate!: boolean
	@ApiProperty() isOwner!: boolean
	@ApiProperty({ required: false, nullable: true }) friendship?: any

	@ApiProperty() id!: string
	@ApiProperty() name!: string
	@ApiProperty({ nullable: true }) picture!: string | null

	@ApiProperty({ required: false }) userId?: string
	@ApiProperty({ required: false, nullable: true }) bannerPicture?:
		| string
		| null
	@ApiProperty({ required: false, nullable: true }) location?: string | null
	@ApiProperty({ required: false, nullable: true }) bio?: string | null
	@ApiProperty({ required: false }) createdAt?: Date
	@ApiProperty({ required: false, nullable: true }) updatedAt?: Date | null

	@ApiProperty({ type: [FriendReferenceDto], required: false })
	friends?: FriendReferenceDto[]
}
