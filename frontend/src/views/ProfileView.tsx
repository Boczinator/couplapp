import { useParams } from '@tanstack/react-router'
import { useCurrentProfile } from '../hooks/useProfile.hook'

export const ProfileView = () => {
	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const { profile, isLoading } = useCurrentProfile(profileId)

	if (isLoading) return <div>Is Loading...</div>
	console.log(profile)

	return (
		<>
			<div>Name: {profile.name}</div>
			<div>Profile Id: {profile.id}</div>
			<div>User Id: {profile.userId}</div>
			<div>Is owner: {String(profile.isOwner)}</div>
		</>
	)
}
