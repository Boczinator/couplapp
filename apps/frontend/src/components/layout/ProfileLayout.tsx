import { Outlet } from '@tanstack/react-router'
import { AuthenticatedHeader } from '../header/AuthenticatedHeader'
import { useSocketHandshake } from '../../hooks/useSocketHandshake'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import logo from '../../assets/couplapp-logo-inline.png'

export const ProfileLayout = () => {
	useSocketHandshake()

	return (
		<SidebarProvider className="h-screen overflow-hidden">
			<AuthenticatedHeader />

			<SidebarInset className="flex flex-col h-full overflow-hidden">
				<header className="flex justify-between h-auto py-2 border-b md:hidden pl-2.5 shrink-0">
					<img src={logo} className="w-40 object-contain object-center" />
					<SidebarTrigger className="md:hidden" />
				</header>

				<div className="flex-1 min-h-0 px-4 pt-7.5 md:px-10 md:py-10 flex flex-col overflow-y-auto">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
