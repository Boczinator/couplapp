import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
	@ApiProperty({ example: '8c91c9d0-6dfd-4ffe-a07d-sdad12312' })
	id!: string

	@ApiProperty({ example: 'john.doe@gmail.com' })
	email!: string

	@ApiProperty({ example: 'John' })
	firstName!: string

	@ApiProperty({ example: 'Doe' })
	lastName!: string

	@ApiProperty({ example: true })
	isVerified!: boolean

	@ApiProperty({ example: 'user' })
	role!: string

	@ApiProperty({ example: '2026-08-06T06:52:20.204Z' })
	createdAt!: Date

	@ApiProperty({ example: '2026-08-06T06:52:20.204Z' })
	updatedAt!: Date
}
