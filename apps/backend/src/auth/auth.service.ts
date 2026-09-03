import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { compare, compareSync, hash } from 'bcryptjs'
import { LoginUserDto } from './login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly userService: UsersService,
	) {}

	async validateUser({ email, password }: LoginUserDto) {
		if (!email) {
			throw new UnauthorizedException('Email or password missing')
		}

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

		if (!user.isVerified) {
			throw new ForbiddenException({
				message: 'Email verification required.',
				errorCode: 'EMAIL_NOT_VERIFIED',
			})
		}

		const { password: pw, refreshToken, ...result } = user

		return result
	}

	async generateTokens({
		userId,
		res,
		activeProfileId,
	}: {
		userId: schema.User['id']
		res: Response
		activeProfileId: string | null
	}) {
		const jwtPayload = {
			sub: userId,
			activeProfileId,
		}

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(jwtPayload, {
				secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
				expiresIn: '5m',
			}),
			this.jwtService.sign(jwtPayload, {
				secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
				expiresIn: '7d',
			}),
		])

		await this.updateRefreshToken(userId, refreshToken)

		this.setTokenCookies(res, accessToken, refreshToken)

		return { accessToken, refreshToken }
	}

	async refreshTokens({
		userId,
		activeProfileId,
		refreshToken,
		res,
	}: {
		userId: schema.User['id']
		activeProfileId: string
		refreshToken: string
		res: Response
	}) {
		const user = await this.userService.findOne(userId)

		if (!user || !user.refreshToken) {
			throw new UnauthorizedException('Access Denied')
		}

		const refreshTokenMatches = await compare(refreshToken, user.refreshToken)

		if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied')

		const tokens = await this.generateTokens({
			userId: user.id,
			activeProfileId,
			res,
		})

		await this.updateRefreshToken(user.id, tokens.refreshToken)

		return tokens
	}

	async updateRefreshToken(userId: schema.User['id'], refreshToken: string) {
		await this.userService.update(userId, {
			refreshToken: await hash(refreshToken, 10),
		})
	}

	async logout(userId: schema.User['id']) {
		await this.userService.update(userId, { refreshToken: null })
	}

	setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
		const isProduction =
			this.configService.get<string>('ENVIRONMENT') === 'production'

		res.cookie('access_token', accessToken, {
			httpOnly: true,
			sameSite: isProduction ? 'strict' : 'lax',
			secure: isProduction,
			maxAge: 300000, // 5 minutes
			path: '/',
		})

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: isProduction ? 'strict' : 'lax',
			secure: isProduction,
			maxAge: 604800000, // 7 days
			path: '/',
		})
	}

	async verifyEmailToken(token: string) {
		if (!token) {
			throw new BadRequestException('Missing verification token!')
		}

		const [user] = await this.db
			.update(schema.users)
			.set({ isVerified: true })
			.where(eq(schema.users.optInToken, token))
			.returning()

		if (user && user.isVerified) {
			return {
				success: true,
				message: 'User successfully verified',
			}
		}

		if (!user) {
			return {
				success: false,
				message: 'Token either expired or not found',
			}
		}
	}
}
