import './App.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/queryClient'

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}
