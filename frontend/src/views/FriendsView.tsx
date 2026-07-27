import { FriendsList } from '../components/friends/FriendsList'
import { FriendsRequests } from '../components/friends/FriendsRequests'

export const FriendsView = () => {
	return (
		<>
			<FriendsRequests />
			<FriendsList />
		</>
	)
}
