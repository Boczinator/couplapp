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
import { TextAreaField } from '../../../components/input/TextAreaField'
import { FormikProvider, useFormik } from 'formik'
import { Button } from '../../../components/button/Button'

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

	// FIX 3: Formik steuert nun das Absenden & den Zustand
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
				conversationId: conversationId || undefined, // undefined statt null mitschicken
				content: values.text,
			})

			resetForm() // Leert das Feld nach erfolgreichem Senden
		},
	})

	if (conversationId && isPending) return <div>Test</div>

	return (
		<>
			<div className="flex flex-col h-full">
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
				<div className="flex-1 overflow-y-auto px-10 py-2.5">
					{messages?.map((msg: any) =>
						msg.senderId === activeProfileId ? (
							<div key={msg.id} className="w-full flex justify-end">
								<div className="w-1/3 mb-2.5 flex justify-end flex-wrap">
									<div
										className={twMerge(
											'bg-[#D1F5F0] w-full px-5 py-2.5 rounded-2xl relative after:absolute after:block after:bg-inherit after:right-0 after:bottom-0 after:size-5 shadow-sm',
										)}
									>
										{msg.content}
									</div>
									<span className="text-sm">
										{formatDate(new Date(msg.createdAt)).time}
									</span>
								</div>
							</div>
						) : (
							<div key={msg.id} className="w-full flex justify-start">
								<div className="w-1/3 mb-2.5 flex justify-start flex-wrap">
									<div
										className={twMerge(
											'bg-[#FFE2DE] w-full px-5 py-2.5 rounded-2xl relative after:absolute after:block after:bg-inherit after:left-0 after:bottom-0 after:size-5 shadow-sm',
										)}
									>
										{msg.content}
									</div>
									<span className="text-sm">
										{formatDate(new Date(msg.createdAt)).time}
									</span>
								</div>
							</div>
						),
					)}
					{!conversationId && (!messages || messages.length === 0) && (
						<div className="text-gray-400">
							Send a message to start chatting!
						</div>
					)}
				</div>
				<FormikProvider value={formik}>
					<form onSubmit={formik.handleSubmit}>
						<div className="px-10 pt-5">
							{/* FIX 4: Bindung an Formik-Values und onChange-Handler */}
							<TextAreaField
								name="text"
								value={formik.values.text}
								onChange={formik.handleChange}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault() // Verhindert ungewollten Zeilenumbruch
										formik.handleSubmit()
									}
								}}
								label="Text"
							/>
							<Button type="submit">Send</Button>
						</div>
					</form>
				</FormikProvider>
			</div>
		</>
	)
}
