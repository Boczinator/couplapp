import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class LoginUserDto {
	@ApiProperty({
		example: 'seb.boczek@gmail.com',
		description: 'The registered email address of the account',
	})
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email!: string

	@ApiProperty({
		example: 'SuperPassword$3213!',
		description: 'The plain-text authentication password',
	})
	@IsString()
	@IsNotEmpty()
	password!: string
}
