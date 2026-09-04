import {
	Body,
	Controller,
	Param,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common'
import { AccountsService } from './accounts.service'
import type { Response } from 'express'
import { CreateProfileDto } from 'src/profiles/dtos/create-profile.dto'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { ProfileDto } from 'src/profiles/dtos/profile.dto'
import { ApiOkResponse } from '@nestjs/swagger'

@Controller('accounts')
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return await this.accountsService.register(createUserDto)
	}

	@UseGuards(JwtAuthGuard)
	@Post('profiles/create')
	async createProfile(
		@Body() profile: CreateProfileDto,
		@Req() req: Request & { user: { id: string } },
		@Res({ passthrough: true }) res: Response,
	) {
		return await this.accountsService.createProfileAndTokens(
			req.user.id,
			profile,
			res,
		)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('profiles/switch/:id')
	@ApiOkResponse({
		type: ProfileDto,
		description: 'Returns the newly switched destiny profile.',
	})
	async switchProfile(
		@Param('id') id: string,
		@Req() req: Request & { user: { id: string } },
		@Res({ passthrough: true }) res: Response,
	): Promise<ProfileDto> {
		return await this.accountsService.switchProfileAndTokens(
			req.user.id,
			id,
			res,
		)
	}
}
