import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { User } from 'src/db/schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => request.cookies?.['access_token'],
			]),
			secretOrKey: configService.getOrThrow('JWT_SECRET_ACCESS_TOKEN'),
		})
	}

	async validate(payload: { sub: User['id'] }) {
		const { refreshToken, ...rest } = await this.usersService.findOne(
			payload.sub,
		)

		return rest
	}
}
