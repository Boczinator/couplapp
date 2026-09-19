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
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { RemovePostDto } from './dto/remove-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { ApiOkResponse } from '@nestjs/swagger'
import {
	LikersProfilesResponseDto,
	LikeToggleResponseDto,
} from './dto/like-post.dto'

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get(':profileId')
	async getPostsByProfile(
		@Param() params: { profileId: string },
		@Req() req: any,
	) {
		const { profileId } = params

		return await this.postsService.getPostsByProfile({
			profileId,
			activeProfileId: req.user.activeProfileId,
		})
	}

	@Get(':id/likers')
	@ApiOkResponse({
		description:
			'A list of profiles containing IDs, names, and profile pictures was successfully retrieved.',
		isArray: true,
		type: LikersProfilesResponseDto,
	})
	async getPostLikers(
		@Param('id') postId: string,
	): Promise<LikersProfilesResponseDto[]> {
		return await this.postsService.getProfilesByLikes(postId)
	}

	@Post('create')
	async create(@Req() req: any, @Body() createPostDto: CreatePostDto) {
		return await this.postsService.createPost({
			profileId: req.user.activeProfileId,
			post: createPostDto,
		})
	}

	@ApiOkResponse({
		type: LikeToggleResponseDto,
		description:
			'Returns liked status of current profile for post and likesCountDelta.',
	})
	@Post(':id/like')
	async likePost(
		@Req() req: any,
		@Param('id') id: string,
	): Promise<LikeToggleResponseDto> {
		return await this.postsService.handlePostLikeToggle({
			activeProfileId: req.user.activeProfileId,
			postId: id,
		})
	}

	@Delete(':id')
	async remove(@Req() req: any, @Param() params: RemovePostDto) {
		return await this.postsService.removePost({
			profileId: req.user.activeProfileId,
			postId: params.id,
		})
	}

	@Patch(':id')
	async update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updatePostDto: UpdatePostDto,
	) {
		return await this.postsService.updatePost({
			postId: id,
			post: updatePostDto,
			profileId: req.user.activeProfileId,
		})
	}
}
