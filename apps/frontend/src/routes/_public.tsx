import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router'
import { PublicLayout } from '../components/layout/PublicLayout'
import { authUserOptions } from '../hooks/useAuthUser'

export const Route = createFileRoute('/_public')({
	component: PublicLayout,
	loader: async ({ context }) => {
		try {
			const user = await context.queryClient.ensureQueryData(authUserOptions)

			if (user) {
				if (user?.activeProfileId) {
					throw redirect({
						to: '/profile/$profileId',
						params: {
							profileId: user?.activeProfileId,
						},
					})
				} else {
					throw redirect({
						to: '/profiles-selection',
					})
				}
			}
		} catch (error) {
			if (isRedirect(error)) {
				throw error
			}

			console.log(error)
		}
	},
})
