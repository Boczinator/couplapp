import { FriendshipRelation } from '../profiles.types'

export class ProfileResponseDto {
	isOwner!: boolean
	isPrivate!: boolean
	friendship?: FriendshipRelation | null
	profile!: Profile
}

export class Profile {
	id!: string
	name!: string
	bio?: string | null
	location?: string | null
	bannerPicture?: string | null
	picture?: string | null
	createdAt!: Date
	updatedAt!: Date
}
