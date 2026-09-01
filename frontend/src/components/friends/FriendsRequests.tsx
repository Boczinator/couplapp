import { useAuthUser } from '../../hooks/useAuthUser'
import {
	useAcceptFriendRequest,
	useFriendRequests,
	useRemoveRelationship,
} from '../../hooks/useFriends'
import { Button } from '../button/Button'
import { ProfileCard } from '../card/ProfileCard'

type FriendsRequestsProps = {
	className: string
}

export const FriendsRequests = ({ className }: FriendsRequestsProps) => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friendRequests, isPending } = useFriendRequests(activeProfileId)
	const { removeRelationship } = useRemoveRelationship()
	const { acceptRequest } = useAcceptFriendRequest()

	if (isPending) return <div>Fetching friend requests...</div>

	return (
		<div className={className}>
			{friendRequests?.some((req) => req.direction === 'INCOMING') && (
				<h1 className="text-2xl text-primary font-bold mb-5">
					Current Friend requests
				</h1>
			)}

			<div>
				{friendRequests &&
					friendRequests?.length > 0 &&
					friendRequests?.map((friendRequest) => {
						return (
							<div className="text-xl rounded-2xl mb-4 flex justify-between items-center">
								<ProfileCard
									image={friendRequest.profile.picture}
									name={friendRequest.profile.name}
								/>
								{friendRequest.direction === 'OUTGOING' ? (
									<Button
										className="w-1/3 text-"
										onClick={() => removeRelationship(friendRequest.profile.id)}
									>
										Remove friend request
									</Button>
								) : (
									<Button
										className="w-1/3"
										onClick={() => acceptRequest(friendRequest.profile.id)}
									>
										Accept
									</Button>
								)}
							</div>
						)
					})}
			</div>
		</div>
	)
}
