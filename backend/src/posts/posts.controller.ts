import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { RemovePostDto } from './dto/remove-post.dto'

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get(':profileId')
	async getPostsByProfile(@Param() params: { profileId: string }) {
		const { profileId } = params

		return await this.postsService.getPostsByProfile({ profileId })
	}

	@Post()
	async create(@Req() req: any, @Body() createPostDto: CreatePostDto) {
		return await this.postsService.createPost({
			profileId: req.user.activeProfileId,
			post: createPostDto,
		})
	}

	@Delete(':id')
	async remove(@Req() req: any, @Param() params: RemovePostDto) {
		return await this.postsService.removePost({
			profileId: req.user.activeProfileId,
			postId: params.id,
		})
	}
}
