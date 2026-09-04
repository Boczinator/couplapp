import { FriendsService } from './friends.service'

export type Friendship = Awaited<
	ReturnType<InstanceType<typeof FriendsService>['getStatus']>
>
