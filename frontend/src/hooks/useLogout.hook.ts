import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutUser } from '../api/auth'
import { useNavigate } from '@tanstack/react-router'

export const useLogout = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const {
		mutate: logout,
		isPending,
		isSuccess,
	} = useMutation({
		mutationFn: () => logoutUser(),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ['user-auth'] })

			navigate({
				to: '/login',
			})
		},
	})

	return {
		logout,
		isPending,
		isSuccess,
	}
}
