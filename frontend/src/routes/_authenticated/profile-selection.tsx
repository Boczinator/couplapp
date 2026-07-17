import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile-selection')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/profile-selection"!</div>
}
