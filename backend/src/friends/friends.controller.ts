import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { FriendsService } from './friends.service'
import { InviteFriendDto } from './dto/invite-friend.dto'

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Get('requests')
	async getRequests(@Req() req: any) {
		return await this.friendsService.getAllRequestsByProfileId(
			req.user.activeProfileId,
		)
	}

	@Get('')
	async getAllFriends(@Req() req: any) {
		return await this.friendsService.getAllFriends(req.user.activeProfileId)
	}

	@Post('invite')
	async invite(@Req() req: any, @Body() inviteFriendDto: InviteFriendDto) {
		return await this.friendsService.sendRequest(
			req.user.activeProfileId,
			inviteFriendDto.receiverId,
		)
	}

	@Delete('remove/:receiverId')
	async remove(@Req() req: any, @Param() params: { receiverId: string }) {
		return await this.friendsService.removeConnection(
			req.user.activeProfileId,
			params.receiverId,
		)
	}

	@Patch('accept/:requesterId')
	async accept(@Req() req: any, @Param() params: { requesterId: string }) {
		console.log(req.user, params)

		return await this.friendsService.acceptRequest(
			req.user.activeProfileId,
			params.requesterId,
		)
	}
}
