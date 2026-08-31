import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { WsException } from '@nestjs/websockets'
import * as cookie from 'cookie'

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		const client = context.switchToWs().getClient()
		const rawCookies = client.handshake.headers.cookie || ''

		const parsedCookies = cookie.parseCookie(rawCookies)

		const tokenFromCookie = parsedCookies.access_token
		const tokenFromHeader =
			client.handshake.headers.authorization ||
			client.handshake.headers.Authorization

		const token = tokenFromCookie || tokenFromHeader

		console.log(token)

		return {
			headers: {
				authorization: token
					? token.startsWith('Bearer ')
						? token
						: `Bearer ${token}`
					: undefined,
			},
			cookies: parsedCookies,
		}
	}

	handleRequest(err: any, user: any) {
		if (err || !user) {
			throw new WsException('Unauthorized WebSocket request!')
		}
		return user
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const result = await super.canActivate(context)

			if (result) {
				const client = context.switchToWs().getClient()
				const req = this.getRequest(context) as any

				if (!req?.user || !req.user.activeProfileId) {
					throw new WsException('Unauthorized: Profile missing.')
				}

				client.user = req.user
			}

			return !!result
		} catch (error) {
			console.log(error)
		}

		return true
	}
}
