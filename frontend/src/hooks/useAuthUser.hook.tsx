import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserMe } from '../api/auth'

export const authUserOptions = queryOptions({
	queryKey: ['user-auth'],
	queryFn: () => {
		return getUserMe()
	},
})

export const useAuthUser = () => {
	const { data: user, isLoading, error } = useQuery(authUserOptions)

	return {
		user,
		isLoading,
		error,
	}
}
