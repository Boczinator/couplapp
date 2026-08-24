import { ProfileCard } from '../components/card/ProfileCard'
import { useAuthUser } from '../hooks/useAuthUser'
import { useFriendsList } from '../hooks/useFriends'

export const MessagesView = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friends, isPending } = useFriendsList(activeProfileId)

	return (
		<>
			<div>
				{friends?.map((friend) => (
					<ProfileCard
						key={friend.id}
						name={friend.name}
						image={friend.picture}
					></ProfileCard>
				))}
			</div>
		</>
	)
}
