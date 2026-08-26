import { Button } from '../components/button/Button'
import { ProfileCard } from '../components/card/ProfileCard'
import { useAuthUser } from '../hooks/useAuthUser'
import { useFriendsList } from '../hooks/useFriends'
import { useInbox } from '../hooks/useInbox'

export const MessagesView = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friends, isPending } = useFriendsList(activeProfileId)

	const { data: conversations } = useInbox()

	console.log(conversations)

	return (
		<>
			<h2 className="text-2xl font-bold mb-10">Your Messages</h2>
			<div>
				{friends?.map((friend) => (
					<div>
						<ProfileCard
							className="flex items-center justify-between"
							key={friend.id}
							name={friend.name}
							image={friend.picture}
							to="/profile/$profileId/messages/$conversationId"
							params={{ conversationId: `profile_${friend.id}` }}
						>
							<Button className="w-auto">Start a conversation</Button>
						</ProfileCard>
					</div>
				))}
			</div>
		</>
	)
}
