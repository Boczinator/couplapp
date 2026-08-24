import { useAuthUser } from '../../hooks/useAuthUser'
import { useFriendsList } from '../../hooks/useFriends'
import { ProfileCard } from '../card/ProfileCard'

export const FriendsList = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friends, isPending } = useFriendsList(activeProfileId)

	if (isPending) return <div>Loading friends...</div>

	return (
		<div>
			{friends && friends?.length > 0 ? (
				<>
					<h2 className="text-2xl font-bold mb-5">Deine Freunde</h2>

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
