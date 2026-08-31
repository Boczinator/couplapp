// src/auth/guards/ws-jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as cookie from 'cookie'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient()
		return await this.authenticateSocket(client)
	}

	async authenticateSocket(client: any): Promise<boolean> {
		try {
			const rawCookies = client.handshake.headers.cookie || ''
			const parsedCookies = cookie.parseCookie(rawCookies)
			const token = parsedCookies.access_token

			if (!token) throw new Error('Missing token.')

			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SECRET_ACCESS_TOKEN,
			})

			const { refreshToken, profiles, ...user } =
				await this.usersService.findOne(payload.sub)

			if (!payload.activeProfileId) throw new Error('Profile unselected.')

			const userOwnsProfile = profiles.some(
				(profile) => profile.id === payload.activeProfileId,
			)

			if (!userOwnsProfile) throw new Error('Unauthorized profile assignment.')

			client.user = {
				...user,
				activeProfileId: payload.activeProfileId,
			}
			client.activeProfileId = payload.activeProfileId

			const tokenExpirationTime = payload.exp ? payload.exp * 1000 : null

			if (tokenExpirationTime) {
				const timeRemaining = tokenExpirationTime - Date.now()

				// Clear any stale timeout if this is a reconnection track
				if (client.authTimeout) clearTimeout(client.authTimeout)

				// Force-disconnect the socket tunnel the exact second the access token expires
				client.authTimeout = setTimeout(() => {
					console.warn(
						`[Socket Security] Access token expired for socket ${client.id}. Evicting.`,
					)
					client.disconnect(true) // 'true' forces a hard close on the socket tunnel
				}, timeRemaining)
			}

			return true
		} catch (error) {
			console.error(`[Socket Security Dropout]: ${error.message}`)
			// Evict malicious or expired users immediately
			client.disconnect(true)
			return false
		}
	}
}
