import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
	@ApiProperty({ example: true })
	success!: boolean

	@ApiProperty({ example: 'User logged in successfully' })
	message!: string
}
