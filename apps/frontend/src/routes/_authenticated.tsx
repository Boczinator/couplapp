import { createFileRoute, redirect } from '@tanstack/react-router'
import { authUserOptions } from '../hooks/useAuthUser'

import { socket } from '../socket/client'

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ context: { queryClient }, location }) => {
		try {
			const user = await queryClient.ensureQueryData(authUserOptions)

			return { user }
		} catch (error) {
			throw redirect({
				to: '/login',
				search: {
					redirect: location.href,
				},
			})
		}
	},
	loader: ({ context }) => {
		const user = context.user

		socket.send('isOnline', user?.activeProfileId)
	},
})
