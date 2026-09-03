import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from 'src/database/database.module'

@Module({
	imports: [ConfigModule, DatabaseModule],
	exports: [MailService],
	providers: [MailService],
})
export class MailModule {}
