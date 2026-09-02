import { createFileRoute } from '@tanstack/react-router'
import { FriendsView } from '../../../views/FriendsView'

export const Route = createFileRoute(
	'/_authenticated/profile/$profileId/friends',
)({
	component: FriendsView,
})
