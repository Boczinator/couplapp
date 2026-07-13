import { createFileRoute } from '@tanstack/react-router'
import { RegistrationVerifyMailSentView } from '../views/RegistrationVerifyMailSentView'

export const Route = createFileRoute('/verify-mail-sent')({
	component: RegistrationVerifyMailSentView,
})
