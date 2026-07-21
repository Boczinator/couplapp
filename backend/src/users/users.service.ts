import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'
import { CreateUserDto } from './dtos/create-user.dto'
import { hashSync } from 'bcryptjs'
import { UpdateUserDto } from './dtos/update-user.dto'
import { MailService } from 'src/mail/mail.service'
import { ProfilesService } from 'src/profiles/profiles.service'

@Injectable()
export class UsersService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly mailService: MailService,
		private readonly profileService: ProfilesService,
	) {}

	async findAll() {
		return await this.db.select().from(schema.users)
	}

	async findOne(id: schema.User['id']) {
		const [user] = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, id))

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}

		const { password, optInToken, ...result } = user

		return result
	}

	async create(createUserDto: CreateUserDto) {
		const [existingUser] = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, createUserDto.email))

		if (existingUser) {
			throw new ConflictException('Email is already taken')
		}

		const password = hashSync(createUserDto.password, 10)

		return await this.db.transaction(async (tx) => {
			const [newUser] = await tx
				.insert(schema.users)
				.values({ ...createUserDto, password })
				.returning()

			await this.mailService.sendVerificationMail(newUser, tx)

			await this.profileService.create(
				{
					name: `${newUser.firstName} ${newUser.lastName}`,
					bio: null,
					picture: null,
					bannerPicture: null,
					location: null,
				},
				newUser.id,
				tx,
			)

			const { refreshToken, password: _, isVerified, ...rest } = newUser

			return rest
		})
	}

	async remove(id: schema.User['id']) {
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

	async update(id: schema.User['id'], updateData: Partial<UpdateUserDto>) {
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
