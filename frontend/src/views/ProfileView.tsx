import { useParams } from '@tanstack/react-router'
import { useCurrentProfile } from '../hooks/useProfile'
import { Button } from '../components/button/Button'
import {
	useAcceptFriendRequest,
	useInviteFriends,
	useRemoveRelationship,
} from '../hooks/useFriends'
import { useAuthUser } from '../hooks/useAuthUser'

export const ProfileView = () => {
	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { profile, isLoading } = useCurrentProfile(profileId)
	const { sendInvite } = useInviteFriends()
	const { removeRelationship } = useRemoveRelationship()
	const { acceptRequest } = useAcceptFriendRequest()

	if (isLoading) return <div>Is Loading...</div>

	return (
		<>
			<div>Name: {profile.name}</div>
			<div>Profile Id: {profile.id}</div>
			<div>User Id: {profile.userId}</div>
			<div>Is owner: {String(profile.isOwner)}</div>
			<div>Friendship status: {profile?.friendship?.status}</div>
			{!profile.isOwner && profile?.friendship?.status === 'accepted' && (
				<Button onClick={() => removeRelationship(profileId)}>
					Remove friend
				</Button>
			)}

			{!profile.isOwner && profile?.friendship === null && (
				<Button onClick={() => sendInvite(profileId)}>Send invite</Button>
			)}

			{profile?.friendship?.status === 'pending' &&
				(profile?.friendship?.actionProfileId !== activeProfileId ? (
					<Button
						onClick={() => acceptRequest(profile?.friendship?.actionProfileId)}
					>
						Accept friend request
					</Button>
				) : (
					<Button onClick={() => removeRelationship(profileId)}>
						Remove friend request
					</Button>
				))}
		</>
	)
}
