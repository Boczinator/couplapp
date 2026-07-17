import { createFileRoute } from '@tanstack/react-router'
import { ProfileSelectionView } from '../../views/ProfileSelectionView'

export const Route = createFileRoute('/_authenticated/profiles-selection')({
	component: ProfileSelectionView,
})
