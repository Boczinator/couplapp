import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<div className="text-base">
			<div>test</div>
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	)
}
