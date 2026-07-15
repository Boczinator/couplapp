import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/feed')({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authenticated/feed"!</div>
}
