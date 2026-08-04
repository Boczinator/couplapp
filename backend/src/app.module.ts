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
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';
import { PostsModule } from './posts/posts.module';
import { FeedModule } from './feed/feed.module';
import { MessagesModule } from './messages/messages.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		DatabaseModule,
		UsersModule,
		MailModule,
		MailerModule.forRoot({
			transport: {
				host: 'localhost',
				port: 1025,
				ignoreTLS: true,
				logger: true,
				debug: true,
			},
			defaults: {
				from: '"No Reply": <noreply@couplapp.com',
			},
			template: {
				dir: join(process.cwd(), 'dist', 'views', 'mail'),
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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
