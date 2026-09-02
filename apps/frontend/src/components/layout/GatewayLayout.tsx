import { Outlet } from '@tanstack/react-router'
import logo from '../../assets/couplapp-logo.png'

export const GatewayLayout = () => {
	return (
		<>
			<header>
				<div className="flex justify-center">
					<img src={logo} className="h-44" />
				</div>
			</header>
			<div className="max-w-200 mx-auto">
				<Outlet />
			</div>
		</>
	)
}
