import { useMutation } from '@tanstack/react-query'
import { registerUser, type CreateUserInput } from '../api/register'
import { useNavigate } from '@tanstack/react-router'
import { ToastTypes, useToast } from '../components/toast/ToastContext'

export const useRegister = () => {
	const navigate = useNavigate()
	const { addToast } = useToast()

	const {
		data: user,
		mutate: register,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: (input: CreateUserInput) => registerUser(input),
		onSuccess: () => {
			navigate({
				to: '/verify-mail-sent',
			})
		},
		onError: (error) => {
			addToast({
				message: error.message || 'Problem with registration',
				type: ToastTypes.Error,
			})
		},
	})

	return {
		user,
		register,
		isPending,
		isError,
		error,
	}
}
