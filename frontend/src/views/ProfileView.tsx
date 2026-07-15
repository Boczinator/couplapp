import { getRouteApi } from '@tanstack/react-router'

export const ProfileView = () => {
	const { user } = getRouteApi('/_authenticated')?.useRouteContext()

	return (
		<>
			<div>First Name: {user.firstName}</div>
			<div>Last Name: {user.lastName}</div>
			<div>Id: {user.id}</div>
		</>
	)
}
