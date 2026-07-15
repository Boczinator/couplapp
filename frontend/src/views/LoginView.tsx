import { useEffect, useState } from 'react'
import { loginUser } from '../api/auth'
import { FormikProvider, useFormik } from 'formik'
import { TextField } from '../components/input/TextField'
import { ToastTypes, useToast } from '../components/toast/ToastContext'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '../components/button/Button'

type LoginFormValues = {
	email: string
	password: string
}

export const LoginView = ({}) => {
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const search = useSearch({ from: '/login' })

	const { addToast } = useToast()

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		onSubmit: async ({ email, password }) => {
			setIsLoading(true)

			try {
				await loginUser(email, password)

				navigate({ to: '/profile', from: '/login' })

				addToast({
					message: 'Success Login!',
					type: ToastTypes.Success,
				})
			} catch (error: any) {
				console.log(error)

				addToast({
					message: error.message,
					type: ToastTypes.Error,
				})
			} finally {
				setIsLoading(false)
			}
		},
		validate: (values) => {
			const errors: Partial<LoginFormValues> = {}

			if (!values.email) {
				errors.email = 'Required field'
			}

			if (!values.password) {
				errors.password = 'Required field'
			}

			return errors
		},
	})

	useEffect(() => {
		if (search.status === 'ready_to_login') {
			addToast({
				message: 'You´re set up to login!',
				type: ToastTypes.Success,
			})
		}
	}, [])

	return (
		<div className="px-40 max-w-200 mx-auto">
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<div className="mb-7.5">
						<div>
							<TextField
								id="email"
								name="email"
								placeholder="Email"
								type="email"
								label="Email"
							/>
						</div>
						<div>
							<TextField
								id="password"
								name="password"
								placeholder="Password"
								type="password"
								label="Password"
							/>
						</div>
					</div>

					<Button className="mb-10" type="submit" disabled={isLoading}>
						Submit
					</Button>
				</form>
			</FormikProvider>

			<div>
				No account yet?{' '}
				<a className="underline text-[#077A7D] text-" href="/register">
					Create an account!
				</a>
			</div>
		</div>
	)
}
