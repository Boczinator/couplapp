import { Button } from '../components/button/Button'
import { ProfileCard } from '../components/card/ProfileCard'
import { useAuthUser } from '../hooks/useAuthUser'
import { useFriendsList } from '../hooks/useFriends'
import { useInbox } from '../hooks/useInbox'

export const MessagesView = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friends } = useFriendsList(activeProfileId)

	const { data: conversations } = useInbox()

	console.log(conversations)
	return (
		<>
			<h2 className="text-2xl font-bold mb-10">Your Chats</h2>
			<div>
				{conversations?.map((conversation) => (
					<div>
						<ProfileCard
							className="flex items-center justify-between mb-10 bg-gray-50 p-5"
							key={conversation.id}
							name={`${
								conversation.participants.filter(
									(p) => p.profileId !== activeProfileId,
								)[0].profile.name
							} & you`}
							image={
								conversation.participants.filter(
									(p) => p.profileId !== activeProfileId,
								)[0].profile.picture
							}
							to="/profile/$profileId/messages/$conversationId"
							params={{ conversationId: conversation.id }}
						>
							<div className="flex items-center gap-5">
								<div className="text-gray-400">
									{conversation.messages[0].content}
								</div>
								<Button className="w-auto">Continue Conversation</Button>
							</div>
						</ProfileCard>
					</div>
				))}
			</div>
			<div>
				{friends?.map((friend) => (
					<div>
						<ProfileCard
							className="flex items-center justify-between px-5 mb-10"
							key={friend.id}
							name={friend.name}
							image={friend.picture}
							to="/profile/$profileId/messages/$conversationId"
							params={{ conversationId: `profile_${friend.id}` }}
						>
							<Button className="w-auto px-5">Send a message!</Button>
						</ProfileCard>
					</div>
				))}
			</div>
		</>
	)
}
