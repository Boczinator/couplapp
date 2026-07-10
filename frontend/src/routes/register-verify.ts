import { createFileRoute } from '@tanstack/react-router'
import { RegistrationVerifyView } from '../views/RegistrationVerifyView'

export const Route = createFileRoute('/register-verify')({
	component: RegistrationVerifyView,
})
