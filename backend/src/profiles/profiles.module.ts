import { Module } from '@nestjs/common'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { DatabaseModule } from 'src/database/database.module'
import { ConfigModule } from '@nestjs/config'
import { FriendsModule } from 'src/friends/friends.module'
import { MailModule } from 'src/mail/mail.module'

@Module({
	controllers: [ProfilesController],
	providers: [ProfilesService],
	imports: [DatabaseModule, ConfigModule, FriendsModule, MailModule],
	exports: [ProfilesService],
})
export class ProfilesModule {}
