import { createFileRoute } from '@tanstack/react-router'
import { InboxView } from '../../../views/InboxView'

export const Route = createFileRoute(
	'/_authenticated/profile/$profileId/inbox',
)({
	component: InboxView,
})
