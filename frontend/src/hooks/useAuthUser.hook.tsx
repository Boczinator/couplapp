import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserMe } from '../api/auth'

export const useAuthUserOptions = queryOptions({
	queryKey: ['user-auth'],
	queryFn: () => {
		return getUserMe()
	},
})

export const useAuthUser = () => {
	const { data: user, isLoading, error } = useQuery(useAuthUserOptions)

	return {
		user,
		isLoading,
		error,
	}
}
