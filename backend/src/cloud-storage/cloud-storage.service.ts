import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CloudStorageService {
	private s3Client: S3Client
	private r2BaseUrl: string

	constructor(private readonly configService: ConfigService) {
		this.s3Client = new S3Client({
			endpoint: this.configService.getOrThrow<string>('R2_ENDPOINT'),
			region: 'auto',
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>('R2_ACCESS_KEY'),
				secretAccessKey: this.configService.getOrThrow<string>(
					'R2_SECRECT_ACCESS_KEY',
				),
			},
		})

		const environment = this.configService.get('ENVIRONMENT')

		this.r2BaseUrl =
			environment === 'production'
				? this.configService.getOrThrow('ENVIRONMENT')
				: 'https://pub-f053dcfe219b4e1383c7e31a9d298396.r2.dev'
	}

	async uploadFile({
		file,
		key,
		isPrivate = true,
	}: {
		file: Express.Multer.File
		key: string
		isPrivate?: boolean
	}) {
		const bucket = isPrivate
			? this.configService.getOrThrow<string>('R2_BUCKET_NAME_PRIVATE')
			: this.configService.getOrThrow<string>('R2_BUCKET_NAME_PUBLIC')

		const uploadCommand = new PutObjectCommand({
			Key: key,
			Bucket: bucket,
			Body: file.buffer,
			ContentType: file.mimetype,
		})

		return await this.s3Client.send(uploadCommand)
	}

	async removeFile({ key, isPrivate }: { key: string; isPrivate: boolean }) {
		const bucket = isPrivate
			? this.configService.getOrThrow<string>('R2_BUCKET_NAME_PRIVATE')
			: this.configService.getOrThrow<string>('R2_BUCKET_NAME_PUBLIC')

		const deleteCommand = new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		})

		this.s3Client.send(deleteCommand)
	}

	async getPrivateUrl() {}

	async getPublicUrl() {}
}
