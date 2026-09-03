import { Module } from '@nestjs/common'
import { FeedService } from './feed.service'
import { FeedController } from './feed.controller'
import { FriendsModule } from 'src/friends/friends.module'

@Module({
	providers: [FeedService],
	controllers: [FeedController],
	imports: [FriendsModule],
	exports: [FeedService],
})
export class FeedModule {}
