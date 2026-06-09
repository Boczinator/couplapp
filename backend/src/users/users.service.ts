import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from './types'

@Injectable()
export class UsersService {
	private users: User[] = []
	private idCounter: number = 0

	findAll(): User[] {
		return this.users
	}

	create({ email, name, password }: Omit<User, 'id'>): User {
		const newUser: User = {
			id: this.idCounter++,
			name,
			email,
			password,
		}

		this.users.push(newUser)

		return newUser
	}

	remove(id: User['id']) {
		const userExists = this.users.find((user) => user.id !== id)

		if (!userExists) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		this.users = this.users.filter((user) => user.id !== id)

		return { message: `User with id ${id} successfully removed!` }
	}

	update(id: User['id'], updateData: Pick<User, 'email' | 'name'>): User {
		const currentUser = this.users.find((user) => user.id === id)

		if (!currentUser) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		const updatedUser = {
			...currentUser,
			...updateData,
		}

		this.users.map((user) => (user.id === id ? updatedUser : user))

		return updatedUser
	}
}
