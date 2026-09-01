import { Link } from '@tanstack/react-router'
import { ProfileCard } from '../components/card/ProfileCard'
import { Button } from '../components/ui/button'
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../components/ui/card'
import { useAuthUser } from '../hooks/useAuthUser'
import { useFriendsList } from '../hooks/useFriends'
import { useInbox } from '../hooks/useInbox'
import { Avatar, AvatarGroup, AvatarImage } from '../components/ui/avatar'
import clsx from 'clsx'

export const InboxView = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friends } = useFriendsList(activeProfileId)

	const { data: conversations, isPending } = useInbox()

	const participants =
		conversations?.flatMap((c) => (c.isGroupChat ? [] : c.participants)) ?? []

	const friendsWithoutChat = friends?.filter(
		(friend) => !participants?.some((p) => friend.id === p.profileId),
	)

	if (isPending) return <div>Loading...</div>

	return (
		<>
			<h2 className="text-2xl  font-bold mb-10">Your Chats</h2>
			<div className="mb-10">
				{conversations?.map((conversation) => (
					<Link
						key={conversation.id}
						to="/profile/$profileId/messages/$conversationId"
						params={{
							profileId: activeProfileId,
							conversationId: conversation.id,
						}}
					>
						<Card
							className={clsx(
								'mb-5 hover:bg-secondary',
								!conversation.messages[0].readAt &&
									conversation.messages[0].senderId !== activeProfileId &&
									'bg-secondary! font-bold',
							)}
						>
							<CardHeader>
								<CardTitle className="flex gap-3 items-center">
									<AvatarGroup>
										{conversation.participants.map((participant) => (
											<Avatar>
												<AvatarImage src={participant.profile.picture} />
											</Avatar>
										))}
									</AvatarGroup>
									{`${
										conversation.participants.filter(
											(participant) =>
												participant.profileId !== activeProfileId,
										)[0].profile.name
									} & you`}
								</CardTitle>
								<CardDescription>
									{conversation.messages[0].content}
								</CardDescription>
								<CardAction>
									<Button>Continue conversation</Button>
								</CardAction>
							</CardHeader>
						</Card>
					</Link>

					/*{ <div>
						<ProfileCard
							className={clsx(
								'flex items-center justify-between mb-10 bg-gray-50 p-5',
								!conversation.messages[0].readAt &&
									conversation.messages[0].senderId !== activeProfileId &&
									'bg-[#ff6f59]! font-bold',
							)}
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
					</div> }*/
				))}
			</div>
			<div>
				{friendsWithoutChat?.map((friend) => (
					<div>
						<ProfileCard
							className="flex items-center justify-between px-5 mb-10"
							key={friend.id}
							name={friend.name}
							image={friend.picture}
							to="/profile/$profileId/messages/$conversationId"
							params={{ conversationId: `profile_${friend.id}` }}
						>
							<Button className="w-auto px-5">Start a conversation</Button>
						</ProfileCard>
					</div>
				))}
			</div>
		</>
	)
}
