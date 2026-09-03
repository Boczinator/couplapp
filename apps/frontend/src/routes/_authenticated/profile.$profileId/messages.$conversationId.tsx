import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { socket } from '../../../socket/client'
import { useAuthUser } from '../../../hooks/useAuthUser'
import {
	useConversationDetails,
	useConversationMessages,
	useMarkConversationAsRead,
} from '../../../hooks/useInbox'
import { twMerge } from 'tailwind-merge'
import { formatDate } from '../../../helpers/date'
import { FormikProvider, useFormik } from 'formik'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'

import {
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
} from '../../../components/ui/message'
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from '../../../components/ui/message-scroller'
import { Bubble, BubbleContent } from '../../../components/ui/bubble'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '../../../components/ui/avatar'

export const Route = createFileRoute(
	'/_authenticated/profile/$profileId/messages/$conversationId',
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { conversationId: id } = useParams({
		from: '/_authenticated/profile/$profileId/messages/$conversationId',
	})

	const isDraft = id?.startsWith('profile_')
	const draftRecipientId = isDraft ? id.replace('profile_', '') : null
	const conversationId = !isDraft ? id : null

	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { data: conversationDetails, isPending } =
		useConversationDetails(conversationId)

	const { data: messages } = useConversationMessages(conversationId)

	const { mutate: markConversationAsRead } = useMarkConversationAsRead()

	const activeRecipientId =
		draftRecipientId ||
		conversationDetails?.participants?.find(
			(p: any) => p.profileId !== activeProfileId,
		)?.profileId

	useEffect(() => {
		function handleIncomingMessage(message: any) {
			const serverConvId = message.conversationId
			console.log('Event im Client empfangen! ConvID:', serverConvId, message)
			if (!serverConvId) return

			queryClient.setQueryData(['messages', serverConvId], (old: any) => {
				return old ? [...old, message] : [message]
			})

			queryClient.invalidateQueries({ queryKey: ['inbox'] })

			if (!conversationId) {
				navigate({
					to: '/profile/$profileId/messages/$conversationId',
					params: {
						profileId: activeProfileId,
						conversationId: serverConvId,
					},
					replace: true,
				})
			}
		}

		socket.on('message', handleIncomingMessage)

		if (conversationId && messages && messages?.length > 0) {
			const lastMessage = messages[messages?.length - 1]
			const isIncoming = lastMessage.senderId !== activeProfileId
			const isUnread = !lastMessage.readAt

			if (isIncoming && isUnread) {
				markConversationAsRead(conversationId)
			}
		}

		return () => {
			socket.off('message', handleIncomingMessage)
		}
	}, [
		conversationId,
		navigate,
		queryClient,
		activeProfileId,
		messages,
		markConversationAsRead,
	])

	const formik = useFormik({
		initialValues: {
			text: '',
		},
		onSubmit: (values, { resetForm }) => {
			if (!values.text.trim()) return

			console.log('Emitting message via Socket...', values.text)

			socket.emit('message', {
				senderId: activeProfileId,
				receiverId: activeRecipientId,
				conversationId: conversationId || undefined,
				content: values.text,
			})

			resetForm()
		},
	})

	if (conversationId && isPending) return <div>Test</div>

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="text-2xl font-bold pb-2.5 border-b">
				{`${
					conversationDetails?.title ||
					conversationDetails?.participants?.filter(
						(p: any) => p.profileId === activeRecipientId,
					)[0]?.profile?.name ||
					'Chat'
				}
					& du`}
			</div>
			<div className="flex-1 px-0 md:px-10 py-2.5 flex flex-col min-h-0 overflow-hidden">
				<MessageScrollerProvider>
					<MessageScroller>
						<MessageScrollerViewport className="md:px-7.5">
							<MessageScrollerContent>
								{messages?.map((msg: any) => (
									<MessageScrollerItem key={msg.id} messageId={msg.id}>
										<Message
											align={msg.senderId === activeProfileId ? 'end' : 'start'}
										>
											<MessageAvatar>
												<Avatar>
													<AvatarImage src={msg.sender.picture} alt="" />
													<AvatarFallback>CN</AvatarFallback>
												</Avatar>
											</MessageAvatar>
											<MessageContent>
												<Bubble
													variant={
														msg.senderId === activeProfileId
															? 'secondary'
															: 'default'
													}
												>
													<BubbleContent>{msg.content}</BubbleContent>
												</Bubble>
												<MessageFooter>
													{formatDate(new Date(msg.createdAt)).time}
												</MessageFooter>
											</MessageContent>
										</Message>
									</MessageScrollerItem>
								))}
								{!conversationId && (!messages || messages.length === 0) && (
									<div className="text-gray-400">
										Send a message to start chatting!
									</div>
								)}
							</MessageScrollerContent>
						</MessageScrollerViewport>
						<MessageScrollerButton />
					</MessageScroller>
				</MessageScrollerProvider>
			</div>
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit} className="shrink-0">
					<div className="md:px-10 pt-5">
						<Textarea
							name="text"
							placeholder="Type your message here."
							className="mb-2.5"
							value={formik.values.text}
							onChange={formik.handleChange}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									formik.handleSubmit()
								}
							}}
						/>
						<Button className="w-full" size="lg" type="submit">
							Send
						</Button>
					</div>
				</form>
			</FormikProvider>
		</div>
	)
}
