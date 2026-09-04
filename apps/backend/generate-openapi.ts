import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './src/app.module'
import * as fs from 'fs'
import * as path from 'path'

async function generate(): Promise<void> {
	// 1. Create full INestApplication instance (without calling app.listen)
	const app = await NestFactory.create(AppModule, {
		logger: false,
	})

	try {
		const config = new DocumentBuilder()
			.setTitle('CouplApp API')
			.setVersion('1.0')
			.build()

		// 2. Pass the full application instance to Swagger
		const document = SwaggerModule.createDocument(app, config)

		const outputPath = path.resolve(
			process.cwd(),
			'../../packages/shared/openapi.json',
		)
		const dir = path.dirname(outputPath)

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf-8')
		console.log(`✅ openapi.json successfully generated at: ${outputPath}`)
	} catch (error) {
		console.error('❌ Failed to generate OpenAPI spec:', error)
		process.exitCode = 1
	} finally {
		// 3. Gracefully close the app instance without binding to any port
		await app.close()
	}
}

void generate()
