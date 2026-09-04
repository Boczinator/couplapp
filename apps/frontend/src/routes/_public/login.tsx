import { createFileRoute } from '@tanstack/react-router'
import { LoginView } from '../../views/LoginView'
import z from 'zod'

const loginSearchSchema = z.object({
	status: z.enum(['missing_token', 'ready_to_login']).optional(),
	redirect: z.string().optional(),
})

export const Route = createFileRoute('/_public/login')({
	component: LoginView,
	validateSearch: (search) => loginSearchSchema.parse(search),
})
