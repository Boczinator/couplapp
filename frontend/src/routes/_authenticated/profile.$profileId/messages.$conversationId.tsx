import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { socket } from '../../../socket/client'
import { useAuthUser } from '../../../hooks/useAuthUser'
import { useConversation } from '../../../hooks/useInbox'

export const Route = createFileRoute(
	'/_authenticated/profile/$profileId/messages/$conversationId',
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { conversationId: id, profileId: routeProfileId } = useParams({
		from: '/_authenticated/profile/$profileId/messages/$conversationId',
	})

	const isDraft = id?.startsWith('profile_')

	// If draft, parse from route param. If active, resolve recipient from conversation data.
	const draftRecipientId = isDraft ? id.replace('profile_', '') : null
	const conversationId = !isDraft ? id : null

	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [text, setText] = useState('')
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { data: messages } = useConversation(conversationId)

	// Fallback: Get recipient from draft route OR active conversation query data

	useEffect(() => {
		function onMessageSent(payload: { message: any; conversationId: string }) {
			const { message, conversationId: serverConvId } = payload

			// 1. Direct cache update for real-time UI updates
			queryClient.setQueryData(
				['conversation', serverConvId],
				(old: any[] = []) => [...old, message],
			)

			// 2. Invalidate inbox/conversations list query to refresh sidebar
			queryClient.invalidateQueries({ queryKey: ['inbox'] })

			// 3. Upgrade route smoothly from draft to active conversation
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

		socket.on('message', onMessageSent)

		return () => {
			socket.off('message', onMessageSent)
		}
	}, [conversationId, navigate, queryClient, activeProfileId])

	const handleSend = () => {
		if (!text.trim()) return

		// Emit socket payload with fallback receiverId
		socket.emit('message', {
			senderId: activeProfileId,
			receiverId: draftRecipientId,
			conversationId,
			content: text,
		})

		setText('')
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto">
				{messages?.map((msg: any) => (
					<div key={msg.id}>{msg.content}</div>
				))}
				{!conversationId && messages?.length === 0 && (
					<div className="text-gray-400">Send a message to start chatting!</div>
				)}
			</div>
			<div className="flex gap-2">
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSend()}
				/>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	)
}
