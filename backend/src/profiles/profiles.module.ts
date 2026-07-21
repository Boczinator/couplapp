import { Module } from '@nestjs/common'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { DatabaseModule } from 'src/database/database.module'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import { MailService } from 'src/mail/mail.service'

@Module({
	controllers: [ProfilesController],
	providers: [
		ProfilesService,
		AuthService,
		JwtService,
		UsersService,
		MailService,
	],
	imports: [DatabaseModule, ConfigModule],
	exports: [ProfilesService],
})
export class ProfilesModule {}
