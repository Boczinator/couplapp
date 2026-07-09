import { queryOptions } from '@tanstack/react-query'
import { client } from '../api/client'

export const useAuthUser = queryOptions({
	queryKey: ['auth-user'],
	queryFn: () => {
		return client.get('/auth/me').json()
	},
	staleTime: Infinity,
})
