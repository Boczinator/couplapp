import { Transform } from 'class-transformer'
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator'

export class GetProfileQueryDto {
	@IsOptional()
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			return value.split(',').map((val) => val.trim())
		}
		return value
	})
	@IsArray()
	@IsIn(['friends'], { each: true })
	includes?: string[]
}
