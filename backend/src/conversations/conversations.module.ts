import { Module } from '@nestjs/common'
import { ConversationsController } from './conversations.controller'
import { ConversationsService } from './conversations.service'
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'

@Module({
	providers: [ConversationsService],
	controllers: [ConversationsController],
	exports: [ConversationsService],
})
export class ConversationsModule {}
