import { Module } from '@nestjs/common'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { DatabaseModule } from 'src/database/database.module'
import { ConfigModule } from '@nestjs/config'

@Module({
	controllers: [ProfilesController],
	providers: [ProfilesService],
	imports: [DatabaseModule, ConfigModule],
	exports: [ProfilesService],
})
export class ProfilesModule {}
