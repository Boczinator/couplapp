import { ApiProperty } from '@nestjs/swagger'
import { UserDto } from 'src/users/dtos/user.dto'

export class AuthUserDto extends UserDto {
	@ApiProperty({ example: '8c91c9d0-6dfd-4fwee-a07d-sdad12312' })
	activeProfileId!: string
}
