import { Profile } from 'src/db/schema'
import { FriendshipResponse } from 'src/friends/friends.types'

export type FriendReference = {
	id: string
	name: string
	picture: string | null | undefined
}

export type BaseProfile = Profile

export type PrivateProfile = {
	isPrivate: boolean
	isOwner: boolean
	friendship?: FriendshipResponse | null | undefined
} & Pick<BaseProfile, 'id' | 'name' | 'picture'>

export type PublicProfile = {
	isPrivate: boolean
	isOwner: boolean
	friendship?: FriendshipResponse | null | undefined
	friends?: FriendReference[]
} & BaseProfile

export type ProfileResponse = PrivateProfile | PublicProfile
