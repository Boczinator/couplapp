import { createFileRoute } from '@tanstack/react-router'

import { ProfileLayout } from '../../components/layout/ProfileLayout'

export const Route = createFileRoute('/_authenticated/profile/$profileId')({
	component: ProfileLayout,
})
