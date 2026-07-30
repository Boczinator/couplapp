import { useNavigate } from '@tanstack/react-router'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useFriendsList } from '../../hooks/useFriends'
import { ProfileCard } from '../card/ProfileCard'

export const FriendsList = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const navigate = useNavigate()

	const { friends, isPending } = useFriendsList(activeProfileId)

	const navigateToFriendPorfile = (
		event: MouseEvent<HTMLAnchorElement, MouseEvent>,
		profileId: string,
	) => {
		event.preventDefault()

		navigate({
			to: '/profile/$profileId',
			params: {
				profileId,
			},
		})
	}

	if (isPending) return <div>Loading friends...</div>

	return (
		<div>
			{friends && friends.length > 0 ? (
				<>
					<h2 className="text-2xl font-bold mb-5">Deine Freunde</h2>

					<div className="flex flex-wrap flex-col gap-5">
						{friends.map((friend) => (
							<button
								onClick={(e) => navigateToFriendPorfile(e, friend.id)}
								key={friend.id}
								className="text-lg w-full cursor-pointer"
							>
								<ProfileCard image={friend.picture} name={friend.name} />
							</button>
						))}
					</div>
				</>
			) : (
				<div>No friends found yet</div>
			)}
		</div>
	)
}
