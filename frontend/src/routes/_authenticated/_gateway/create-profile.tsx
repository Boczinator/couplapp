import { createFileRoute } from '@tanstack/react-router'
import { CreateProfileView } from '../../../views/CreateProfileView'

export const Route = createFileRoute('/_authenticated/_gateway/create-profile')(
	{
		component: CreateProfileView,
	},  
)
