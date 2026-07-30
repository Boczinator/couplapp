import { Outlet } from '@tanstack/react-router'
import { AuthenticatedHeader } from '../header/AuthenticatedHeader'

export const ProfileLayout = () => {
	return (
		<div className="flex">
			<AuthenticatedHeader />

			<div className="flex-1 px-10 py-10">
				<Outlet />
			</div>
		</div>
	)
}
