import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
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
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				(request: Request) => {
					console.log(request)
					console.log(request.cookies?.['access_token'])
					return request.cookies?.['access_token']
				},
			]),
			secretOrKey: configService.getOrThrow('JWT_SECRET_ACCESS_TOKEN'),
		})
	}

	async validate(payload: { sub: User['id']; activeProfileId: string }) {
		const { refreshToken, profiles, ...rest } = await this.usersService.findOne(
			payload.sub,
		)

		// important: check for validating, if current user owns active Profile
		if (payload.activeProfileId) {
			const userOwnsProfile = profiles.some(
				(profile) => profile.id === payload.activeProfileId,
			)

			if (!userOwnsProfile) {
				throw new UnauthorizedException(
					'Unauthorized profile association detected.',
				)
			}
		}

		return {
			...rest,
			activeProfileId: payload.activeProfileId,
		}
	}
}
