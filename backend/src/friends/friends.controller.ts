import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { FriendsService } from './friends.service'
import { InviteFriendDto } from './dto/invite-friend.dto'

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Post('invite')
	async invite(@Req() req: any, @Body() inviteFriendDto: InviteFriendDto) {
		return await this.friendsService.sendRequest(
			req.user.activeProfileId,
			inviteFriendDto.receiverId,
		)
	}
}
