import { ApiProperty } from '@nestjs/swagger'

export class ProfileDto {
	@ApiProperty() id!: string
	@ApiProperty() name!: string
	@ApiProperty({ type: String, nullable: true })
	picture!: string | null
	@ApiProperty({ required: false }) userId?: string
	@ApiProperty({ type: String, nullable: true })
	bannerPicture?: string | null
	@ApiProperty({ required: false, nullable: true }) location?: string | null
	@ApiProperty({ required: false, nullable: true }) bio?: string | null
	@ApiProperty({ required: false }) createdAt?: Date
	@ApiProperty({ type: Date, nullable: true, required: false })
	updatedAt?: Date | null

	@ApiProperty() isPrivate!: boolean | null
}
