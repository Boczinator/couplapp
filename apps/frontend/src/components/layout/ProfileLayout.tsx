import { Outlet } from '@tanstack/react-router'
import { AuthenticatedHeader } from '../header/AuthenticatedHeader'
import { useSocketHandshake } from '../../hooks/useSocketHandshake'

export const ProfileLayout = () => {
	useSocketHandshake()

	return (
		<div className="flex">
			<AuthenticatedHeader />

			<div className="flex-1 px-10 py-10 h-dvh overflow-y-auto">
				<Outlet />
			</div>
		</div>
	)
}
