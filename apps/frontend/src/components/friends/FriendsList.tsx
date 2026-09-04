import { useParams } from '@tanstack/react-router'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useFriendsList } from '../../hooks/useFriends'
import { ProfileCard } from '../card/ProfileCard'
import { useCurrentProfile } from '../../hooks/useProfile'

export const FriendsList = () => {
	const { profileId } = useParams({ strict: true })
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const isOwnProfile = profileId === activeProfileId

	const { friends, isPending } = useFriendsList(profileId)

	const { profile, isLoading: isPendingProfile } = useCurrentProfile(profileId)

	if (isPending || isPendingProfile) return <div>Loading friends...</div>

	return (
		<div>
			{friends && friends?.length > 0 ? (
				<>
					<h2 className="text-2xl  font-bold mb-5">
						{isOwnProfile ? 'Your friends' : `${profile?.name}´s friends`}
					</h2>

					<div className="flex flex-wrap flex-col gap-5">
						{friends?.map((friend) => (
							<ProfileCard
								key={friend.id}
								image={friend.picture}
								name={friend.name}
								to="/profile/$profileId"
								params={{ profileId: friend.id }}
							/>
						))}
					</div>
				</>
			) : (
				<div>No friends found yet</div>
			)}
		</div>
	)
}
