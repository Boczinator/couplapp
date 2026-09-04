export type FriendshipResponse = {
	profileId1: string
	profileId2: string
	status: 'pending' | 'accepted' | 'blocked'
	actionProfileId: string
} | null
