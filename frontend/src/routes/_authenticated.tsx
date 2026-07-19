import { createFileRoute, redirect } from '@tanstack/react-router'
import { authUserOptions } from '../hooks/useAuthUser.hook'

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ context: { queryClient }, location }) => {
		try {
			const user = await queryClient.ensureQueryData(authUserOptions)

			console.log(user)
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
})
