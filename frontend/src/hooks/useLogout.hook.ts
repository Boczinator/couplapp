import { useMutation } from '@tanstack/react-query'
import { logoutUser } from '../api/auth'
import { queryClient } from '../App'

export const useLogout = () => {
	return useMutation({
		mutationFn: () => {
			return logoutUser()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-auth'] })
		},
	})
}
