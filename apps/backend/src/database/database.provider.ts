import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from '../db/schema'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'

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

		// Candidate paths relative to __dirname and process.cwd()
		const candidatePaths = [
			// Relative to this file location in development (src/database/database.provider.ts -> apps/backend/drizzle)
			path.resolve(__dirname, '../../drizzle'),
			// Relative to compiled location in dist (dist/src/database/database.provider.js -> apps/backend/drizzle)
			path.resolve(__dirname, '../../../drizzle'),
			// Fallback process root paths
			path.resolve(process.cwd(), 'apps/backend/drizzle'),
			path.resolve(process.cwd(), 'drizzle'),
		]

		// Find the first folder that contains meta/_journal.json
		const migrationsFolder = candidatePaths.find((dir) =>
			fs.existsSync(path.join(dir, 'meta', '_journal.json')),
		)

		if (!migrationsFolder) {
			logger.error(
				`Could not locate 'meta/_journal.json'. Checked paths:\n` +
					candidatePaths
						.map((p) => ` - ${path.join(p, 'meta', '_journal.json')}`)
						.join('\n'),
			)
			throw new Error('Drizzle migrations folder was not found.')
		}

		try {
			logger.log(`Executing database migrations from: ${migrationsFolder}`)
			await migrate(db, { migrationsFolder })
			logger.log('Database migrations completed successfully.')
		} catch (error) {
			logger.error('Database migration failed:', error)
			throw error
		}

		return db
	},
}
