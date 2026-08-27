import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { ConversationsService } from './conversations.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
	constructor(private readonly conversationsService: ConversationsService) {}

	@Get()
	async getInbox(@Req() req: any) {
		return this.conversationsService.getInbox(req.user.activeProfileId)
	}

	@Get(':conversationId/details')
	async getConversationDetails(@Param() param: { conversationId: string }) {
		return await this.conversationsService.getConversationDetails(
			param.conversationId,
		)
	}

	@Get(':conversationId/messages')
	async getConversationMessages(@Param() param: { conversationId: string }) {
		return await this.conversationsService.getConversationMessages(
			param.conversationId,
		)
	}
}
