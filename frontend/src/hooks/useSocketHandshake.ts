import { useEffect } from 'react'
import { socket } from '../socket/client'
import { useAuthUser } from './useAuthUser'
import { useToast } from '../components/toast/ToastContext'

export const useSocketHandshake = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { addToast } = useToast()

	useEffect(() => {
		if (activeProfileId) {
			// Aktualisiere die Query-Parameter für den Handshake
			socket.io.opts.query = { activeProfileId }

			// Falls bereits verbunden, trennen und neu verbinden mit der richtigen ID
			if (socket.connected) {
				socket.disconnect()
			}

			socket.connect()
			console.log(
				'[Socket] Client verbindet sich mit Profil-ID:',
				activeProfileId,
			)

			const triggerToastOnEvent = (message) => {
				addToast({
					type: 'info',
					message: message.content,
				})
				console.log(message)
			}

			socket.on('message', triggerToastOnEvent)

			return () => socket.off('message', triggerToastOnEvent)
		}
	}, [activeProfileId])
}
