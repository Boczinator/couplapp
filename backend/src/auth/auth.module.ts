import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DatabaseModule } from 'src/database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UsersService } from 'src/users/users.service'
import { MailModule } from 'src/mail/mail.module'
import { ProfilesModule } from 'src/profiles/profiles.module'

@Module({
	imports: [
		PassportModule,
		JwtModule.register({}),
		DatabaseModule,
		UsersModule,
		MailModule,
		ProfilesModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtRefreshStrategy, JwtStrategy, UsersService],
})
export class AuthModule {}
