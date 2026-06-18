import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { User } from './types'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'
import { CreateUserDto } from './dtos/create-user.dto'
import { hashSync } from 'bcryptjs'
import { UpdateUserDto } from './dtos/update-user.dto'

@Injectable()
export class UsersService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async findAll() {
		return await this.db.select().from(schema.users)
	}

	async findOne(id: number) {
		const [user] = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, id))

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		return user
	}

	async create(createUserDto: CreateUserDto) {
		const password = hashSync(createUserDto.password, 10)

		const [newUser] = await this.db
			.insert(schema.users)
			.values({ ...createUserDto, password })
			.returning()

		return newUser
	}

	async remove(id: User['id']) {
		const userExists = await this.db
			.select({
				userId: schema.users.id,
			})
			.from(schema.users)
			.where(eq(schema.users.id, id))

		if (!userExists) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		const [removedUser] = await this.db
			.delete(schema.users)
			.where(eq(schema.users.id, id))
			.returning()

		return { message: `User with id ${removedUser.id} successfully removed!` }
	}

	async update(id: User['id'], updateData: Partial<UpdateUserDto>) {
		const currentUser = await this.db
			.select({
				userId: schema.users.id,
			})
			.from(schema.users)
			.where(eq(schema.users.id, id))

		if (!currentUser) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		const [updatedUser] = await this.db
			.update(schema.users)
			.set({
				...updateData,
			})
			.where(eq(schema.users.id, id))
			.returning()

		return updatedUser
	}
}
