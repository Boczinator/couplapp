import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { FriendsService } from './friends.service'
import { InviteFriendDto } from './dto/invite-friend.dto'
import { ProfileDto } from 'src/profiles/dtos/profile.dto'
import { ApiOkResponse } from '@nestjs/swagger'
import { FriendRequestDto } from './dto/response-friend-request.dto'

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Get('requests')
	@ApiOkResponse({
		type: FriendRequestDto,
		isArray: true,
		description: 'Returns all friend requests for authenticated profile.',
	})
	async getRequests(@Req() req: any): Promise<FriendRequestDto[]> {
		return await this.friendsService.getAllRequestsByProfileId(
			req.user.activeProfileId,
		)
	}

	@Get(':profileId')
	@ApiOkResponse({
		type: ProfileDto,
		isArray: true,
		description: 'Returns a level-one flat array of profile items.',
	})
	async getFriends(
		@Param('profileId') targetProfileId: string,
		@Req() req: any,
	): Promise<ProfileDto[]> {
		return await this.friendsService.getAllFriends(targetProfileId)
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
		return await this.friendsService.acceptRequest(
			req.user.activeProfileId,
			params.requesterId,
		)
	}
}
