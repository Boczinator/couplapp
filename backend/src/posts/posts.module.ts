import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { FeedModule } from 'src/feed/feed.module'

@Module({
	providers: [PostsService],
	controllers: [PostsController],
	imports: [FeedModule],
})
export class PostsModule {}
