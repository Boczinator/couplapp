import { Module } from '@nestjs/common'
import { MessagesGateway } from './messages.gateway'
import { MessagesService } from './messages.service'
import { ConversationsModule } from 'src/conversations/conversations.module'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { WsJwtAuthGuard } from 'src/auth/guards/ws-jwt-auth-guard'

@Module({
	providers: [MessagesGateway, MessagesService, WsJwtAuthGuard],
	imports: [ConversationsModule, AuthModule, UsersModule],
})
export class MessagesModule {}
