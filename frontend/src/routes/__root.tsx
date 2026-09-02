import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ToastProvider } from '../components/toast/ToastContext'
import { ToastContainer } from '../components/toast/ToastContainer'

export interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<div className="text-base">
			<ToastProvider>
				<Outlet />
				<ToastContainer />
			</ToastProvider>
			<TanStackRouterDevtools />
		</div>
	)
}
