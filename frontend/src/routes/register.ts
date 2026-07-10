import { createFileRoute } from '@tanstack/react-router'
import { RegistrationView } from '../views/RegistrationView'

export const Route = createFileRoute('/register')({
	component: RegistrationView,
})
