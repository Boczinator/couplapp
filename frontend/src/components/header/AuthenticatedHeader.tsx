import { HeaderLink } from '../link/HeaderLink'
import logo from '../../assets/couplapp-logo-inline.png'
import { useLogout } from '../../hooks/useLogout.hook'
import { Link, useParams } from '@tanstack/react-router'
import { useCurrentProfile } from '../../hooks/useProfile.hook'
//import { ReactComponent as SvgIcon } from '../../assets/icons/logout-svgrepo-com.svg?react'

export const AuthenticatedHeader = () => {
	const { logout } = useLogout()

	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const { profile, isLoading } = useCurrentProfile(profileId)

	const handleLogoutClick = () => {
		logout()
	}

	if (isLoading) return <div>Is Loading...</div>

	return (
		<header className="flex flex-col shadow-xl h-dvh w-1/5 overflow-y-auto pb-5">
			<div className="flex sticky top-0 w-full bg-white">
				<img src={logo} className="w-60 h-20 object-cover object-center" />
			</div>
			<nav className="flex flex-1 flex-col py-5 px-5">
				<HeaderLink href="/profile/$profileId">Home</HeaderLink>
				<HeaderLink href="/profile/$profileId/feed">My Feed</HeaderLink>
				<HeaderLink href="/profile/$profileId/friends">My Friends</HeaderLink>
				<HeaderLink href="/profiles-selection">Profiles Overview</HeaderLink>
			</nav>

			<div className="flex justify-between px-5 py-5 border-t border-[#06202B] items-center">
				<Link to="/profiles-selection">{profile.name}</Link>
				<button className="cursor-pointer" onClick={handleLogoutClick}>
					{/* <SvgIcon /> */}
					Logout
				</button>
			</div>
		</header>
	)
}
