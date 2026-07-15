import { getRouteApi } from '@tanstack/react-router'

export const ProfileView = () => {
	const { user } = getRouteApi('/_authenticated')?.useRouteContext()

	return (
		<>
			<div>Name: {user.name}</div>
			<div>Id: {user.id}</div>
		</>
	)
}
