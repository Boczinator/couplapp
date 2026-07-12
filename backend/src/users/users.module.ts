import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard'
import { MailService } from 'src/mail/mail.service'

@Module({
	controllers: [UsersController],
	providers: [UsersService, JwtAuthGuard, MailService],
	exports: [UsersService],
})
export class UsersModule {}
