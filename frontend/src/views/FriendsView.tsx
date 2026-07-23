import { Button } from '../components/button/Button'
import { useAuthUser } from '../hooks/useAuthUser'
import {
	useAcceptFriendRequest,
	useFriendRequests,
	useFriendsList,
	useRemoveRelationship,
} from '../hooks/useFriends'

export const FriendsView = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friendRequests, isPending } = useFriendRequests(activeProfileId)
	const { acceptRequest } = useAcceptFriendRequest()
	const { friends, isPending: friendsLoading } = useFriendsList(activeProfileId)
	const { removeRelationship } = useRemoveRelationship()

	if (isPending) return <div>Loading...</div>

	return (
		<>
			{friendRequests?.some((req) => req.direction === 'INCOMING') && (
				<h1 className="text-2xl font-bold mb-5">Current Friend requests</h1>
			)}

			<div>
				{friendRequests &&
					friendRequests?.length > 0 &&
					friendRequests?.map((friendRequest) => {
						if (friendRequest.direction === 'INCOMING')
							return (
								<div className="text-xl rounded-2xl mb-4 flex justify-between bg-[hsl(8,75%,81%)] items-center pl-5">
									{friendRequest.profile.name}
									<Button
										className="w-1/2"
										onClick={() => acceptRequest(friendRequest.profile.id)}
									>
										Accept
									</Button>
								</div>
							)
						if (friendRequest.direction === 'OUTGOING')
							return (
								<div className="text-xl rounded-2xl mb-4 flex justify-between bg-[hsl(8,75%,81%)] items-center pl-5">
									{friendRequest.profile.name}
									<Button
										className="w-1/2"
										onClick={() => removeRelationship(friendRequest.profile.id)}
									>
										Remove friend request
									</Button>
								</div>
							)
					})}
			</div>

			<div>
				{friends && friends.length > 0 ? (
					<div>
						<h2 className="text-2xl font-bold mb-5">Deine Freunde</h2>
						{friends.map((friend) => (
							<div key={friend.id} className="text-lg mb-2">
								{friend.name}
							</div>
						))}
					</div>
				) : (
					<div>No friends found yet</div>
				)}
			</div>
		</>
	)
}
