import { useEffect } from 'react'
import { socket } from '../socket/client'
import { useActiveProfileId } from './useAuthUser'
import { useToast } from '../components/toast/ToastContext'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { client } from '../api/client'
import { components } from '@couplapp/shared'

export const useSocketHandshake = () => {
	const activeProfileId = useActiveProfileId()

	const queryClient = useQueryClient()

	const { addToast } = useToast()

	const { conversationId } = useParams({ strict: false })

	useEffect(() => {
		if (!activeProfileId) return

		socket.io.opts.query = { activeProfileId }

		socket.on('disconnect', async (reason) => {
			console.log(`[Socket] Disconnected due to: ${reason}`)

			if (reason === 'io server disconnect') {
				try {
					console.log('[Socket] Refreshing credentials via HTTP endpoint...')

					await client.post('/auth/refresh')

					socket.connect()
				} catch (error) {
					console.error(
						'[Socket] Silent session refresh failed. User must log in.',
						error,
					)
				}
			}
		})

		if (socket.connected) {
			socket.disconnect()
		}

		socket.connect()

		const handleIncomingMessage = (
			message: components['schemas']['ChatMessageDto'],
		) => {
			queryClient.invalidateQueries({
				queryKey: ['inbox'],
			})

			if (message.conversationId) {
				queryClient.invalidateQueries({
					queryKey: ['messages', message.conversationId],
				})
			}

			if (
				message.senderId !== activeProfileId &&
				message.conversationId !== conversationId
			) {
				addToast({
					type: 'info',
					message: 'Du hast eine neue Nachricht!',
				})
			}
		}

		socket.on('message', handleIncomingMessage)

		return () => {
			socket.off('message', handleIncomingMessage)
			socket.disconnect()
		}
	}, [activeProfileId, queryClient, conversationId])
}
