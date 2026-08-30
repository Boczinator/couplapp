import { HeaderLink } from '../link/HeaderLink'
import logo from '../../assets/couplapp-logo-inline.png'
import { useLogout } from '../../hooks/useLogout'
import { Link } from '@tanstack/react-router'
import { useCurrentProfile } from '../../hooks/useProfile'
import { useAuthUser } from '../../hooks/useAuthUser'
import { SearchBar } from '../search/SearchBar'
import { useFriendRequests } from '../../hooks/useFriends'
import { ProfileCard } from '../card/ProfileCard'
import { useInbox } from '../../hooks/useInbox'
//import { ReactComponent as SvgIcon } from '../../assets/icons/logout-svgrepo-com.svg?react'

export const AuthenticatedHeader = () => {
	const { logout } = useLogout()
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { friendRequests } = useFriendRequests(activeProfileId)
	const { profile, isLoading } = useCurrentProfile(activeProfileId)
	const { data: conversations } = useInbox(activeProfileId)

	const incomingFriendRequestsAmount = friendRequests?.filter(
		(friendRequest) => friendRequest.direction === 'INCOMING',
	).length

	const unreadConversations = conversations?.filter(
		(conversation) =>
			conversation.messages[0].senderId !== activeProfileId &&
			!conversation.messages[0].readAt,
	)

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
						to="/profile/$profileId"
						params={{ profileId: profile?.id }}
					>
						Home
					</HeaderLink>
					<HeaderLink
						to="/profile/$profileId/feed"
						params={{ profileId: profile?.id }}
					>
						My Feed
					</HeaderLink>
					<HeaderLink
						className="flex justify-between w-full"
						to="/profile/$profileId/friends"
						params={{ profileId: profile?.id }}
					>
						My Friends
						{incomingFriendRequestsAmount > 0 && (
							<span className="text-sm p-1 font-bold bg-[#7AE2CF] rounded-full inline-block h-fit min-w-6 leading-4 text-center items-center">
								{incomingFriendRequestsAmount}
							</span>
						)}
					</HeaderLink>
					<HeaderLink to="/profile/$profileId/inbox">
						Messages
						{unreadConversations?.length > 0 && (
							<span className="text-sm p-1 font-bold bg-[#7AE2CF] rounded-full inline-block h-fit min-w-6 leading-4 text-center items-center">
								{unreadConversations?.length}
							</span>
						)}
					</HeaderLink>
				</nav>

				<div className="flex justify-between py-5 border-t border-[#06202B] items-center">
					<ProfileCard
						name={profile?.name}
						image={profile?.picture}
						to="/profiles-selection"
					/>
					<button className="cursor-pointer" onClick={handleLogoutClick}>
						{/* <SvgIcon /> */}
						Logout
					</button>
				</div>
			</div>
		</header>
	)
}
