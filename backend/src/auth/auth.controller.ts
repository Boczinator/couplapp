import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto } from './login-user.dto'
import type { Response } from 'express'
import { AuthGuard } from './auth.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(
		@Body() { email, password }: LoginUserDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken, cookieOptions } = await this.authService.validateUser({
			email,
			password,
		})

		res.cookie('access_token', accessToken, cookieOptions)

		return {
			success: true,
		}
	}

	@UseGuards(AuthGuard)
	@Get('me')
	getProfile() {
		return 'profile'
	}
}
