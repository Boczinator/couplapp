import { createFileRoute, redirect } from '@tanstack/react-router'
import z from 'zod'
import { verifyRegisterToken } from '../../api/register'

const verifySearchTokenSchema = z.object({
	token: z.string().catch(''),
})

export const Route = createFileRoute('/_public/verify-mail')({
	validateSearch: (search) => verifySearchTokenSchema.parse(search),
	beforeLoad: async ({ search }) => {
		const { token } = search
		let isSuccess = false

		if (!token) {
			throw redirect({
				to: '/login',
				search: { status: 'missing_token' },
			})
		}

		try {
			const response = await verifyRegisterToken(token)

			if (response.success) {
				isSuccess = true
			}
		} catch (error) {
			console.log(error)
		}

		if (isSuccess) {
			throw redirect({
				to: '/login',
				search: { status: 'ready_to_login' },
			})
		}
	},
})
