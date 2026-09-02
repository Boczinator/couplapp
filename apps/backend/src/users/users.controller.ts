import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { User } from 'src/db/schema'

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	async findAll() {
		return await this.usersService.findAll()
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findUser(@Param('id') id: User['id']) {
		return await this.usersService.findOne(id)
	}

	@Delete()
	async removeUser(@Param('id') id: User['id']) {
		await this.usersService.remove(id)
	}

	@Post('create')
	async createUser(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto)
	}
}
