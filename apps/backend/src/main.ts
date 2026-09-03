import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())
	app.enableCors({
		origin: 'http://localhost:5173',
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: 'Content-Type, Accept, Authorization',
	})

	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	app.useGlobalFilters(new AllExceptionsFilter())

	await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
