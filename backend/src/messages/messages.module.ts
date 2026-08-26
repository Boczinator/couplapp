import { Module } from '@nestjs/common'
import { MessagesGateway } from './messages.gateway'
import { MessagesService } from './messages.service'
import { ConversationsModule } from 'src/conversations/conversations.module'

@Module({
	providers: [MessagesGateway, MessagesService],
	imports: [ConversationsModule],
})
export class MessagesModule {}
