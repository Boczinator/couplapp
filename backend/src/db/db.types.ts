// database.types.ts
import { PgTransaction } from 'drizzle-orm/pg-core'
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import { ExtractTablesWithRelations } from 'drizzle-orm'
import * as schema from './schema' // 👈 Import your actual schema file

export type DbTransaction = PgTransaction<
	NodePgQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>
