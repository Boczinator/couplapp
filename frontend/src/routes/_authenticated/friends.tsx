import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/friends')({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authenticated/friends"!</div>
}
