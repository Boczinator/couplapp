import { createFileRoute } from '@tanstack/react-router'
import { DashboardView } from '../../views/ProfileView'

export const Route = createFileRoute('/_authenticated/profile')({
	component: DashboardView,
})
