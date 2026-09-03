import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePostDto {
	@IsNotEmpty()
	@IsString()
	text!: string
}
