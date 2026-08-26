import { createFileRoute } from '@tanstack/react-router'
import { MessagesView } from '../../../views/MessagesView'

export const Route = createFileRoute(
	'/_authenticated/profile/$profileId/inbox',
)({
	component: MessagesView,
})
