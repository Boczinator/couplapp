import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { MailModule } from './mail/mail.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { PugAdapter } from '@nestjs-modules/mailer/adapters/pug.adapter'
import { ProfilesModule } from './profiles/profiles.module'
import { FriendsModule } from './friends/friends.module'
import { AccountsModule } from './accounts/accounts.module'
import { FilesModule } from './files/files.module'
import { CloudStorageModule } from './cloud-storage/cloud-storage.module'
import { PostsModule } from './posts/posts.module'
import { FeedModule } from './feed/feed.module'
import { MessagesModule } from './messages/messages.module'
//import { RedisModule } from './redis/redis.module'
import { ConversationsService } from './conversations/conversations.service'
import { ConversationsModule } from './conversations/conversations.module'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		DatabaseModule,
		UsersModule,
		MailModule,
		MailerModule.forRoot({
			transport: {
				host: process.env.MAIL_HOST || 'localhost',
				port: parseInt(process.env.MAIL_PORT || '1025', 10),
				secure: process.env.MAIL_SECURE === 'true',
				auth: process.env.MAIL_USER
					? {
							user: process.env.MAIL_USER,
							pass: process.env.MAIL_PASS,
						}
					: undefined,
				logger: process.env.NODE_ENV !== 'production',
				debug: process.env.NODE_ENV !== 'production',
			},
			defaults: {
				from: process.env.MAIL_FROM || '"No Reply" <noreply@couplapp.com>',
			},
			template: {
				dir: join(process.cwd(), 'apps', 'backend', 'dist', 'views', 'mail'),
				adapter: new PugAdapter(),
				options: {
					strict: true,
				},
			},
		}),
		ProfilesModule,
		FriendsModule,
		AccountsModule,
		FilesModule,
		CloudStorageModule,
		PostsModule,
		FeedModule,
		MessagesModule,
		ConversationsModule,
		//RedisModule,
	],
	controllers: [AppController],
	providers: [AppService, ConversationsService],
})
export class AppModule {}
