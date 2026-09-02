import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { MulterModule } from '@nestjs/platform-express'
import { CloudStorageModule } from 'src/cloud-storage/cloud-storage.module'

@Module({
	imports: [MulterModule, CloudStorageModule],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
