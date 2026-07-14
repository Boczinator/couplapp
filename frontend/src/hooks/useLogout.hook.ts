import { useMutation } from '@tanstack/react-query'
import { logoutUser } from '../api/auth'
import { queryClient } from '../api/queryClient'
import { useNavigate } from '@tanstack/react-router'

export const useLogout = () => {
	const navigate = useNavigate()

	const {
		mutate: logout,
		isPending,
		isSuccess,
	} = useMutation({
		mutationFn: () => logoutUser(),
		onSuccess: () => {
			queryClient.resetQueries({ queryKey: ['user-auth', ] })

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
