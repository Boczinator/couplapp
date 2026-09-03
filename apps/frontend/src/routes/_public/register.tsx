import { createFileRoute } from '@tanstack/react-router'
import { RegistrationView } from '../../views/RegistrationView'

export const Route = createFileRoute('/_public/register')({
	component: RegistrationView,
})
