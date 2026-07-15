import { Outlet } from '@tanstack/react-router'
import { AuthenticatedHeader } from '../header/AuthenticatedHeader'

export const AuthenticatedLayout = () => {
	return (
		<div className="flex">
			<AuthenticatedHeader />
			<div className="flex-1 px-10 py-15">
				<Outlet />
			</div>
		</div>
	)
}
