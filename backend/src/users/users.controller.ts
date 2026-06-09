import { Controller, Delete, Get, HostParam } from '@nestjs/common'
import type { User } from './types'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	findAll(): User[] {
		return this.usersService.findAll()
	}

	@Delete()
	removeUser(@HostParam('id') id: number): void {
		this.usersService.remove(id)
	}
}
