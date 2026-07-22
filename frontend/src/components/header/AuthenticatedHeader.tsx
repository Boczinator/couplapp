import { HeaderLink } from '../link/HeaderLink'
import logo from '../../assets/couplapp-logo-inline.png'
import { useLogout } from '../../hooks/useLogout'
import { Link } from '@tanstack/react-router'
import { useCurrentProfile } from '../../hooks/useProfile'
import { useAuthUser } from '../../hooks/useAuthUser'
import { SearchBar } from '../search/SearchBar'
//import { ReactComponent as SvgIcon } from '../../assets/icons/logout-svgrepo-com.svg?react'

export const AuthenticatedHeader = () => {
	const { logout } = useLogout()
	const { user } = useAuthUser()

	const { profile, isLoading } = useCurrentProfile(user?.activeProfileId)

	const handleLogoutClick = () => {
		logout()
	}

	if (isLoading) return <div>Is Loading...</div>

	return (
		<header className="flex flex-col shadow-xl h-dvh w-1/5 overflow-y-auto pb-5">
			<div className="flex sticky top-0 w-full bg-white z-10">
				<img src={logo} className="w-60 h-20 object-cover object-center" />
			</div>
			<div className="px-5 flex flex-col h-full">
				<SearchBar />
				<nav className="flex flex-1 flex-col py-5">
					<HeaderLink
						href="/profile/$profileId"
						params={{ profileId: profile?.id }}
					>
						Home
					</HeaderLink>
					<HeaderLink
						href="/profile/$profileId/feed"
						params={{ profileId: profile?.id }}
					>
						My Feed
					</HeaderLink>
					<HeaderLink
						href="/profile/$profileId/friends"
						params={{ profileId: profile?.id }}
					>
						My Friends
					</HeaderLink>
					<HeaderLink href="/profiles-selection">Profiles Overview</HeaderLink>
				</nav>

				<div className="flex justify-between py-5 border-t border-[#06202B] items-center">
					<Link to="/profiles-selection">{profile?.name}</Link>
					<button className="cursor-pointer" onClick={handleLogoutClick}>
						{/* <SvgIcon /> */}
						Logout
					</button>
				</div>
			</div>
		</header>
	)
}
