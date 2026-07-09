import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../api/auth'
import { queryClient } from '../App'

export const useLogin = () => {
	return useMutation({
		mutationFn: (data) => {
			return loginUser(data.email, data.password)
        },
		onSuccess: (user) => {
			queryClient.setQueryData(['auth-user'], user)
		},
	})
}
