import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'
import { ConversationsService } from 'src/conversations/conversations.service'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
		autoConnect: false,
		credentials: true,
	},
})
export class MessagesGateway {
	@WebSocketServer()
	server!: Server

	constructor(private readonly conversationsService: ConversationsService) {}

	handleConnection(client: Socket) {
		console.log(client)
		// ACHTUNG: Stelle sicher, dass das Frontend die ID genau hier mitschickt!
		const profileId = client.handshake.query.activeProfileId

		if (profileId) {
			console.log(
				`[Socket] Profil ${profileId} hat Raum betreten: profile:${profileId}`,
			)
			client.join(`profile:${profileId}`)
		} else {
			console.warn('[Socket] Verbindung ohne activeProfileId aufgebaut!')
		}
	}

	@SubscribeMessage('message')
	async handleMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		payload: {
			senderId: string
			receiverId: string
			conversationId?: string
			content: string
		},
	) {
		const message = await this.conversationsService.createMessage({
			senderId: payload.senderId,
			receiverId: payload.receiverId,
			conversationId: payload.conversationId,
			content: payload.content,
		})

		// Emit only to the recipient's private room
		this.server.to(`profile:${payload.receiverId}`).emit('message', message)

		// Emit back to the sender (useful if using multiple tabs/devices)
		this.server.to(`profile:${payload.senderId}`).emit('message', message)

		console.log(
			`[Socket] Event an profile:${payload.senderId} und profile:${payload.receiverId} gesendet.`,
		)

		return message
	}
}
