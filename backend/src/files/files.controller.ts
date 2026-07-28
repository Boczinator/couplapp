import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import 'multer'

@Controller('upload')
export class FilesController {
	@Post('profile')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 100000000 }),
					new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		
	}
}
