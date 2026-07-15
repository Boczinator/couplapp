import { Outlet } from '@tanstack/react-router'
import { PublicHeader } from '../header/PublicHeader'

export const PublicLayout = () => {
	return (
		<>
			<PublicHeader />
			<div className="max-w-200 mx-auto sm:px-40 px-5">
				<Outlet />
			</div>
		</>
	)
}
