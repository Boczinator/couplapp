import { useMutation } from '@tanstack/react-query'
import { registerUser, type CreateUserInput } from '../api/register'
import { useNavigate } from '@tanstack/react-router'

export const useRegister = () => {
	const navigate = useNavigate()

	const {
		data: user,
		mutate: register,
		isPending,
		isError,
	} = useMutation({
		mutationFn: (input: CreateUserInput) => registerUser(input),
		onSuccess: () => {
			navigate({
				to: '/verify-mail-sent',
			})
		},
	})

	return {
		user,
		register,
		isPending,
		isError,
	}
}
