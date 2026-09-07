import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import path from 'path'
import * as fs from 'fs'

const allowedOrigins = [
	'http://localhost:5173',
	'http://localhost:4173',
	process.env.FRONTEND_URL,
].filter(Boolean)

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())
	app.enableCors({
		origin: allowedOrigins,
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: 'Content-Type, Accept, Authorization',
	})

	app.setGlobalPrefix('api')

	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	app.useGlobalFilters(new AllExceptionsFilter())
	const config = new DocumentBuilder()
		.setTitle('CouplApp API')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)

	if (process.env.NODE_ENV !== 'production') {
		const outputPath = path.resolve(
			process.cwd(),
			'../../packages/shared/openapi.json',
		)

		const dir = path.dirname(outputPath)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))
	}

	SwaggerModule.setup('api/docs', app, document)

	await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
