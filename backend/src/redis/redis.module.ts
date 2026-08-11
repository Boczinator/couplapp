import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import Redis from 'ioredis'

export const REDIS_PROVIDER = 'REDIS_PROVIDER'

@Global()
@Module({
	providers: [
		{
			provide: REDIS_PROVIDER,
			useFactory: () => {
				return new Redis({
					host: 'localhost',
					port: 6379,
				})
			},
		},
		RedisService,
	],
})
export class RedisModule {}
