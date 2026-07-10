import { getRouteApi } from '@tanstack/react-router'
import { useLogout } from '../hooks/useLogout.hook'

export const ProfileView = () => {
	const { user } = getRouteApi('/_authenticated')?.useRouteContext()

	const { logout, isPending } = useLogout()

	const handleOnLogoutClick = () => {
		logout()
	}

	if (isPending) {
		return <div>Logging out...</div>
	}

	return (
		<>
			<div>Name: {user.name}</div>
			<div>Id: {user.id}</div>
			<button onClick={handleOnLogoutClick}>Logout</button>
		</>
	)
}
