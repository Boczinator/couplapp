import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class RegistrationTokenVerificationDto {
	@ApiProperty({
		description: 'Indicates whether the token verification was successful',
		example: true,
	})
	@IsBoolean()
	success!: boolean

	@ApiProperty({
		description: 'A status message describing the outcome of the verification',
		example: 'Token verified successfully.',
	})
	@IsString()
	message!: string
}
