import { useParams } from '@tanstack/react-router'
import { useCurrentProfile } from '../hooks/useProfile'
import { Button } from '../components/button/Button'
import { useInviteFriends } from '../hooks/useFriends'

export const ProfileView = () => {
	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const { profile, isLoading } = useCurrentProfile(profileId)
	const { sendInvite } = useInviteFriends()

	if (isLoading) return <div>Is Loading...</div>

	return (
		<>
			<div>Name: {profile.name}</div>
			<div>Profile Id: {profile.id}</div>
			<div>User Id: {profile.userId}</div>
			<div>Is owner: {String(profile.isOwner)}</div>
			<div>Friendship status: {profile?.friendship?.status}</div>
			{!profile.isOwner && (
				<Button onClick={() => sendInvite(profileId)}>
					Send friend request
				</Button>
			)}
		</>
	)
}
