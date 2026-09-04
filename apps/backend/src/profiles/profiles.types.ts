import { Profile } from 'src/db/schema'
import { Friendship } from 'src/friends/friends.types'

export type FriendReference = {
	id: string
	name: string
	picture: string | null | undefined
}

export type BaseProfile = Profile

export type PrivateProfile = {
	isPrivate: boolean
	isOwner: boolean
	friendship?: Friendship | null | undefined
} & Pick<BaseProfile, 'id' | 'name' | 'picture'>

export type PublicProfile = {
	isPrivate: boolean
	isOwner: boolean
	friendship?: Friendship | null | undefined
	friends?: FriendReference[]
} & BaseProfile

export type ProfileResponse = PrivateProfile | PublicProfile

/* export interface DomainProfile {
	id: string
	userId: string
	name: string
	picture?: string | null
	bannerPicture?: string | null
	location?: string | null
	bio?: string | null
	isPrivate: boolean | null
	createdAt: Date
	updatedAt: Date | null
}

export interface BaseProfileDomainModel {
	isOwner: boolean
	friendship?: FriendshipRelation | null
}

export interface PublicProfileDomainModel extends BaseProfileDomainModel {
	isPrivate: false
	profile: DomainProfile
	friends?: DomainProfile[]
}

export interface PrivateProfileDomainModel extends BaseProfileDomainModel {
	isPrivate: true
	profile: Pick<DomainProfile, 'id' | 'name' | 'picture'>
}

export type ProfileQueryResult =
	| PublicProfileDomainModel
	| PrivateProfileDomainModel
 */
