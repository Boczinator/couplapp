import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'dgram'

@WebSocketGateway({
	cors: {
		credentials: true,
	},
})
export class MessagesGateway {
	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: string): string {
		console.log(payload)
		return 'Hello world!'
	}
}
