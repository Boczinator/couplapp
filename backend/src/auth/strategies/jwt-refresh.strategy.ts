import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: (req: Request) => req?.cookies?.['refresh_token'] || null,
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow('JWT_SECRET_REFRESH_TOKEN'),
			passReqToCallback: true,
		})
	}

	validate(req: Request, payload: any) {
		const refreshToken = req.cookies?.['refresh_token']
		if (!refreshToken) throw new UnauthorizedException()

		return { userId: payload.sub, email: payload.email, refreshToken }
	}
}
