import { createFileRoute } from '@tanstack/react-router'
import { FeedView } from '../../../views/FeedView'

export const Route = createFileRoute('/_authenticated/profile/$profileId/feed')(
	{
		component: FeedView,
	},
)
