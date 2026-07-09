import { getRouteApi } from '@tanstack/react-router'

export const DashboardView = () => {
	const { user } = getRouteApi('/_authenticated')?.useRouteContext()

	return (
		<>
			<div>Name: {user.name}</div>
			<div>Id: {user.id}</div>
		</>
	)
}
