import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import type { User } from './types'
import { UsersService } from './users.service'
import { CreateUserDto } from './create-user.dto'

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	async findAll() {
		return await this.usersService.findAll()
	}

	@Get(':id')
	async findUser(@Param('id') id: User['id']) {
		return await this.usersService.findOne(id)
	}

	@Delete()
	async removeUser(@Param('id') id: number) {
		await this.usersService.remove(id)
	}

	@Post()
	async createUser(@Body() createUserDto: CreateUserDto) {
		await this.usersService.create(createUserDto)
	}
}
