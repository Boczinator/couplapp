import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { NotFoundView } from './views/NotFoundView'
import { queryClient } from './api/queryClient'

export const router = createRouter({
	routeTree: routeTree,
	defaultNotFoundComponent: NotFoundView,
	context: {
		queryClient: queryClient,
	},
	defaultViewTransition: false,
	scrollRestoration: true,
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}
