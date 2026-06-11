import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DatabaseModule } from 'src/database/database.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
			}),
		}),
		DatabaseModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
