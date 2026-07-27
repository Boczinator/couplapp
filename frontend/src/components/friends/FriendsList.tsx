import { useNavigate } from '@tanstack/react-router'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useFriendsList } from '../../hooks/useFriends'

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

					<div className="flex flex-wrap">
						{friends.map((friend) => (
							<a
								onClick={(e) => navigateToFriendPorfile(e, friend.id)}
								key={friend.id}
								className="text-lg mb-2 w-full"
							>
								{friend.name}
							</a>
						))}
					</div>
				</>
			) : (
				<div>No friends found yet</div>
			)}
		</div>
	)
}
