import { HeaderLink } from '../link/HeaderLink'
import logo from '../../assets/couplapp-logo-inline.png'
import { useLogout } from '../../hooks/useLogout'
import { useCurrentProfile } from '../../hooks/useProfile'
import { useActiveProfileId, useAuthUser } from '../../hooks/useAuthUser'
import { SearchBar } from '../search/SearchBar'
import { useFriendRequests } from '../../hooks/useFriends'
import { ProfileCard } from '../card/ProfileCard'
import { useInbox } from '../../hooks/useInbox'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from '../ui/sidebar'
import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
//import { ReactComponent as SvgIcon } from '../../assets/icons/logout-svgrepo-com.svg?react'

export const AuthenticatedHeader = () => {
	const { logout } = useLogout()
	const activeProfileId = useActiveProfileId()

	const { friendRequests } = useFriendRequests(activeProfileId)
	const { profile, isLoading } = useCurrentProfile(activeProfileId)
	const { data: conversations } = useInbox()

	const { setOpenMobile } = useSidebar()

	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	})

	useEffect(() => {
		setOpenMobile(false)
	}, [pathname])

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
		<Sidebar>
			<SidebarHeader>
				<img src={logo} className="px-10 py-5 w-full object-center" />
				<SearchBar />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Profile</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton className="w-full">
									<HeaderLink
										to="/profile/$profileId/feed"
										params={{ profileId: profile?.id }}
									>
										Home
									</HeaderLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton>
									<HeaderLink
										to="/profile/$profileId"
										params={{ profileId: profile?.id }}
									>
										My Profile
									</HeaderLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton>
									<HeaderLink
										className="flex justify-between w-full"
										to="/profile/$profileId/friends"
										params={{ profileId: profile?.id }}
									>
										My Friends
										{incomingFriendRequestsAmount > 0 && (
											<span className="text-sm p-1 font-bold bg-primary text-secondary rounded-full inline-block h-fit min-w-6 leading-4 text-center items-center">
												{incomingFriendRequestsAmount}
											</span>
										)}
									</HeaderLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton>
									<HeaderLink
										to="/profile/$profileId/inbox"
										params={{ profileId: profile?.id }}
									>
										Messages
										{unreadConversations?.length > 0 && (
											<span className="text-sm p-1 font-bold bg-primary text-secondary rounded-full inline-block h-fit min-w-6 leading-4 text-center items-center">
												{unreadConversations?.length}
											</span>
										)}
									</HeaderLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div className="flex justify-between py-5 border-t border-[#06202B] items-center">
					<ProfileCard
						name={profile?.name}
						image={profile?.picture}
						to="/profiles-selection"
					/>
					<button className="cursor-pointer" onClick={handleLogoutClick}>
						Logout
					</button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
