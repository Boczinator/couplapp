export class FriendshipStatusDto {
	profileId1!: string
	profileId2!: string
	status!: 'pending' | 'accepted' | 'blocked'
	actionProfileId!: string
}
