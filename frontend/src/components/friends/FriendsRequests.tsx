import { useAuthUser } from '../../hooks/useAuthUser'
import {
	useAcceptFriendRequest,
	useFriendRequests,
	useRemoveRelationship,
} from '../../hooks/useFriends'
import { Button } from '../button/Button'

export const FriendsRequests = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friendRequests, isPending } = useFriendRequests(activeProfileId)
	const { removeRelationship } = useRemoveRelationship()
	const { acceptRequest } = useAcceptFriendRequest()

	if (isPending) return <div>Fetching friend requests...</div>

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
		</>
	)
}
