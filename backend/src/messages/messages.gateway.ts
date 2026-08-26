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
		credentials: true,
	},
})
export class MessagesGateway {
	@WebSocketServer()
	server!: Server

	constructor(private readonly conversationsService: ConversationsService) {}

	handleConnection(client: Socket) {
		const profileId = client.handshake.query.activeProfileId

		if (profileId) {
			client.join(`profile:${profileId}`)
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
		console.log(payload)
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

		return message
	}
}
