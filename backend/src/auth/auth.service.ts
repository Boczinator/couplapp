import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { compareSync } from 'bcryptjs'
import { LoginUserDto } from './login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CookieOptions } from 'express'

@Injectable()
export class AuthService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async validateUser({ email, password }: LoginUserDto) {
		const [user] = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, email))

		if (!user) {
			throw new UnauthorizedException('Invalid email or password')
		}

		const passwordMatches = compareSync(password, user.password)

		if (!passwordMatches) {
			throw new UnauthorizedException('Invalid email or password')
		}

		const jwtPayload = {
			sub: user.id,
			name: user.name,
		}

		const isProduction =
			this.configService.get<string>('ENVIRONMENT') === 'production'

		return {
			accessToken: await this.jwtService.signAsync(jwtPayload),
			cookieOptions: {
				httpOnly: true,
				sameSite: isProduction ? 'strict' : 'lax',
				secure: isProduction,
				maxAge: 5 * 60 * 1000,
				path: '/',
			} as CookieOptions,
		}
	}
}
