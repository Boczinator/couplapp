import { createFileRoute } from '@tanstack/react-router'
import { GatewayLayout } from '../../components/layout/GatewayLayout'

export const Route = createFileRoute('/_authenticated/_gateway')({
	component: GatewayLayout,
})
