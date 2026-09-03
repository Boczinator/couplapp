import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'
import { ConfigService } from '@nestjs/config'

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER'

export const databaseProvider = {
	provide: DRIZZLE_PROVIDER,
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const databaseUrl = configService.get('DATABASE_URL')

		const pool = new Pool({
			connectionString: databaseUrl,
		})

		return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>
	},
}
