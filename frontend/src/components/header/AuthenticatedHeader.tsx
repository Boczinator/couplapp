import { HeaderLink } from '../link/HeaderLink'
import logo from '../../assets/couplapp-logo-inline.png'
import { useLogout } from '../../hooks/useLogout.hook'
import { getRouteApi } from '@tanstack/react-router'
//import { ReactComponent as SvgIcon } from '../../assets/icons/logout-svgrepo-com.svg?react'

export const AuthenticatedHeader = () => {
	const { logout } = useLogout()

	const { user } = getRouteApi('/_authenticated')?.useRouteContext()

	const handleLogoutClick = () => {
		logout()
	}
	return (
		<header className="flex flex-col border-r-2 border-[#06202B] h-dvh w-1/4 overflow-y-auto pb-5">
			<div className="flex sticky top-0 w-full bg-white">
				<img src={logo} className="w-60 h-20 object-cover object-center" />
			</div>
			<nav className="flex flex-1 flex-col py-5 px-5">
				<HeaderLink href="/profile">Home</HeaderLink>
				<HeaderLink href="/feed">Feed</HeaderLink>
				<HeaderLink href="/friends">Friends</HeaderLink>
			</nav>

			<div className="flex justify-between px-5 py-5 border-t border-[#06202B] items-center">
				<div>{user.name}</div>
				<button className="cursor-pointer" onClick={handleLogoutClick}>
					{/* <SvgIcon /> */}
					Logout
				</button>
			</div>
		</header>
	)
}
