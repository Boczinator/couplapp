import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common'
import { ConversationsService } from './conversations.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { ChatMessageWithSenderDto } from './dto/message.dto'
import { ApiOkResponse } from '@nestjs/swagger'
import { ConversationDto, InboxConversationDto } from './dto/conversation.dto'

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
	constructor(private readonly conversationsService: ConversationsService) {}

	@Get()
	@ApiOkResponse({
		type: InboxConversationDto,
		isArray: true,
		description:
			'Returns all conversations from authenticated profile with first message for preview.',
	})
	async getInbox(@Req() req: any): Promise<InboxConversationDto[]> {
		return this.conversationsService.getInbox(req.user.activeProfileId)
	}

	@Get(':conversationId/details')
	@ApiOkResponse({
		type: ConversationDto,
		description: 'Returns the conversation details.',
	})
	async getConversationDetails(
		@Param() param: { conversationId: string },
	): Promise<ConversationDto> {
		return await this.conversationsService.getConversationDetails(
			param.conversationId,
		)
	}

	@Get(':conversationId/messages')
	@ApiOkResponse({
		type: ChatMessageWithSenderDto,
		isArray: true,
		description: 'Returns all messages from requested conversation.',
	})
	async getConversationMessages(
		@Param() param: { conversationId: string },
	): Promise<ChatMessageWithSenderDto[]> {
		return await this.conversationsService.getConversationMessages(
			param.conversationId,
		)
	}

	@Patch(':conversationId/read')
	async readConversation(
		@Param('conversationId') conversationId: string,
		@Req() req: any,
	) {
		const profileId = req.user.activeProfileId

		return await this.conversationsService.markAsRead({
			conversationId,
			profileId,
		})
	}
}
