import {
	Body,
	Controller,
	Get,
	Post,
	Res,
	Req,
	UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto } from './login-user.dto'
import { type Response } from 'express'
import { JwtRefreshGuard } from './guards/jwt-refresh-guard'
import { JwtAuthGuard } from './guards/jwt-auth-guard'
import { UsersService } from 'src/users/users.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}

	@Post('login')
	async login(
		@Body() { email, password }: LoginUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const user = await this.authService.validateUser({
			email,
			password,
		})
		const tokens = await this.authService.generateTokens(user.id, user.email)

		await this.authService.updateRefreshToken(user.id, tokens.refreshToken)

		this.authService.setTokenCookies(
			res,
			tokens.accessToken,
			tokens.refreshToken,
		)

		return {
			success: true,
			message: 'User logged in successfully',
		}
	}

	@Post('verify-registration-token')
	async verifyRegistrationToken(@Body() { token }: { token: string }) {
		const data = await this.authService.verifyEmailToken(token)

		return data
	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh')
	async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
		const tokens = await this.authService.refreshTokens(
			req.user.userId,
			req.user.refreshToken,
		)

		this.authService.setTokenCookies(
			res,
			tokens.accessToken,
			tokens.refreshToken,
		)

		return {
			message: 'refresh successfully',
		}
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
		await this.authService.logout(req.user.id)
		res.clearCookie('access_token')
		res.clearCookie('refresh_token')

		return {
			message: 'Logged out successfully',
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	getProfile(@Req() req: any) {
		return req.user
	}
}
