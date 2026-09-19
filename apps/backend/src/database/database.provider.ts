import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from '../db/schema'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import * as path from 'path'

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER'

export const databaseProvider = {
	provide: DRIZZLE_PROVIDER,
	inject: [ConfigService],
	useFactory: async (configService: ConfigService) => {
		const logger = new Logger('DatabaseProvider')
		const databaseUrl = configService.get<string>('DATABASE_URL')

		const pool = new Pool({
			connectionString: databaseUrl,
		})

		const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>

		try {
			logger.log('Executing database migrations...')
			const migrationsFolder = path.resolve(
				process.cwd(),
				'apps/backend/drizzle',
			)

			await migrate(db, { migrationsFolder })
			logger.log('Database migrations completed successfully.')
		} catch (error) {
			logger.error('Database migration failed:', error)
			throw error
		}

		return db
	},
}
