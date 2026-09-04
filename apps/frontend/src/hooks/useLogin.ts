import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginUser } from '../api/auth'
import { LoginPayload, LoginResponse } from '@/api/types'

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation<LoginResponse, Error, LoginPayload>({
		mutationFn: async (payload) => {
			const data = await loginUser(payload)

			return data as LoginResponse
		},
		onSuccess: (user) => {
			queryClient.setQueryData(['user-auth'], user)
		},
	})
}
