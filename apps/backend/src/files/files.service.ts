import { Injectable } from '@nestjs/common'
import { CloudStorageService } from 'src/cloud-storage/cloud-storage.service'

@Injectable()
export class FilesService {
	constructor(private readonly cloudStorageService: CloudStorageService) {}

	async generateUrlAndUploadFile({
		file,
		key,
		isPrivate,
	}: {
		file: Express.Multer.File
		key: string
		isPrivate?: boolean
	}) {
		return await this.cloudStorageService.uploadFile({
			file,
			key,
			isPrivate,
		})
	}

	async removeFile({
		key,
		isPrivate,
	}: {
		key: string
		isPrivate: boolean
	}) {
		return await this.cloudStorageService.removeFile({
			key,
			isPrivate,
		})
	}
}
