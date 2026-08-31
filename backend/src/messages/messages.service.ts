import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from '../db/schema'

@Injectable()
export class MessagesService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
    ) { }
}
