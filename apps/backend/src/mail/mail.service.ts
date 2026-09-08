import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'
import { ConfigService } from '@nestjs/config'
import { eq } from 'drizzle-orm'
import { MailerService } from '@nestjs-modules/mailer'
import * as crypto from 'crypto'
import { DbTransaction } from 'src/db/db.types'

@Injectable()
export class MailService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
		private readonly configService: ConfigService,
		private readonly mailerService: MailerService,
	) {}

	async createOptInToken(userId: schema.User['id'], tx?: DbTransaction) {
		const client = tx || this.db
		const token = crypto.randomBytes(32).toString('hex')

		const [{ optInToken }] = await client
			.update(schema.users)
			.set({ optInToken: token })
			.where(eq(schema.users.id, userId))
			.returning()

		return optInToken
	}

	async sendVerificationMail(user: schema.User, tx?: DbTransaction) {
		const token = await this.createOptInToken(user.id, tx)

		const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-mail?token=${token}`

		try {
			const response = await this.mailerService.sendMail({
				to: user.email,
				subject: 'Welcome! Please Confirm your Email',
				template: 'verify-email',
				context: {
					name: `${user.firstName} ${user.lastName}`,
					verificationUrl,
				},
			})

			if (response) {
				return {
					success: true,
				}
			}
		} catch (error) {
			console.error('--- MAIL EXECUTOR CRASH DETAILS ---', error)
			throw new InternalServerErrorException(
				'Registration succeeded, but your verification email could not be sent. Please try again later.',
			)
		}
	}
}
