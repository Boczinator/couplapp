import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserMe } from '../api/auth'

export const useAuthUserOptions = queryOptions({
	queryKey: ['auth-user'],
	queryFn: () => {
		return getUserMe()
	},
	staleTime: Infinity,
})

export const useAuthUser = () => {
	const { data: user, isLoading, error } = useQuery(useAuthUserOptions)

	return {
		user,
		isLoading,
		error,
	}
}
