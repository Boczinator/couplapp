import { Outlet } from '@tanstack/react-router'
import { AuthenticatedHeader } from '../header/AuthenticatedHeader'
import { useSocketHandshake } from '../../hooks/useSocketHandshake'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar'

export const ProfileLayout = () => {
	useSocketHandshake()

	return (
		<SidebarProvider>
			<AuthenticatedHeader />

			<SidebarInset>
				<header>
					<SidebarTrigger className="md:hidden" />
				</header>
				<div className="flex-1 px-5 md:px-10 py-10 h-dvh overflow-y-auto">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
