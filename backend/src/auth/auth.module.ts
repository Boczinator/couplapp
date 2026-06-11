import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DatabaseModule } from 'src/database/database.module'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				global: true,
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: '5m',
				},
			}),
		}),
		DatabaseModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
