import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ToastProvider } from '../components/toast/ToastContext'
import { ToastContainer } from '../components/toast/ToastContainer'
import logo from './../assets/couplapp-logo.png'

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<div className="text-base bg-[#FDEB9E]">
			<ToastProvider>
				<header>
					<div className="flex justify-center">
						<img src={logo} className="h-44" />
					</div>
				</header>
				<Outlet />
				<ToastContainer />
			</ToastProvider>
			<TanStackRouterDevtools />
		</div>
	)
}
