import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { MailModule } from 'src/mail/mail.module'

@Module({
	imports: [PassportModule, JwtModule.register({}), UsersModule, MailModule],
	controllers: [AuthController],
	providers: [AuthService, JwtRefreshStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
