import { UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'
import { WsJwtAuthGuard } from 'src/auth/guards/ws-jwt-auth-guard'
import { ConversationsService } from 'src/conversations/conversations.service'
import { User } from 'src/db/schema'

export interface AuthenticatedSocket extends Socket {
	user: User & { activeProfileId: string }
	activeProfileId: string
}

@UseGuards(WsJwtAuthGuard)
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

	constructor(
		private readonly conversationsService: ConversationsService,
		private readonly wsJwtAuthGuard: WsJwtAuthGuard,
	) {}

	async handleConnection(client: AuthenticatedSocket) {
		const isAuthorized = await this.wsJwtAuthGuard.authenticateSocket(client)

		if (!isAuthorized) {
			return
		}

		client.join(`profile:${client.user.activeProfileId}`)
	}

	@SubscribeMessage('message')
	async handleMessage(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody()
		payload: {
			senderId: string
			receiverId: string
			conversationId?: string
			content: string
		},
	) {
		const message = await this.conversationsService.createMessage({
			senderId: client?.user?.activeProfileId, // TODO: remove, is now being set by verified jwt 
			receiverId: payload.receiverId,
			conversationId: payload.conversationId,
			content: payload.content,
		})

		const senderId = client?.user?.activeProfileId

		this.server.to(`profile:${payload.receiverId}`).emit('message', message)

		this.server.to(`profile:${senderId}`).emit('message', message)

		console.log(
			`[Socket] Event an profile:${senderId} und profile:${payload.receiverId} gesendet.`,
		)

		return message
	}

	@OnEvent('chat.conversation_read')
	async handleConversationRead(payload: {
		conversationId: string
		profileId: string
	}) {
		this.server
			.to(`conversationId:${payload.conversationId}`)
			.emit('conversation_read', { payload })
	}
}
