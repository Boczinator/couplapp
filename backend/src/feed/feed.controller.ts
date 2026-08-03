import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { FeedService } from './feed.service'

@UseGuards(JwtAuthGuard)
@Controller('feed')
export class FeedController {
	constructor(private readonly feedService: FeedService) {}

	@Get()
	async getFeed(@Req() req: any) {
		return await this.feedService.getFeed(req.user.activeProfileId)
	}
}
