import { Module } from '@nestjs/common'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { UsersModule } from 'src/users/users.module'
import { ProfilesModule } from 'src/profiles/profiles.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [UsersModule, ProfilesModule, AuthModule],
	controllers: [AccountsController],
	providers: [AccountsService],
})
export class AccountsModule {}
