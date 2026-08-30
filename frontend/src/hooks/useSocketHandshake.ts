import { useEffect } from 'react'
import { socket } from '../socket/client'
import { useAuthUser } from './useAuthUser'
import { useToast } from '../components/toast/ToastContext'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

export const useSocketHandshake = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const queryClient = useQueryClient()

	const { addToast } = useToast()

	const { conversationId } = useParams({ strict: false })

	useEffect(() => {
		if (activeProfileId) {
			socket.io.opts.query = { activeProfileId }

			if (socket.connected) {
				socket.disconnect()
			}

			socket.connect()

			const handleIncomingMessage = (message) => {
				if (
					message.senderId !== activeProfileId &&
					message.conversationId !== conversationId
				) {
					addToast({
						type: 'info',
						message: 'Du hast eine neue Nachricht!',
					})

					queryClient.invalidateQueries({
						queryKey: ['inbox'],
					})
				}
			}

			socket.on('message', handleIncomingMessage)

			return () => {
				socket.off('message', handleIncomingMessage)
				socket.disconnect()
			}
		}
	}, [activeProfileId, queryClient, conversationId])
}
