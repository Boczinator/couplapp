import { useState } from 'react'
import { loginUser } from '../api/auth'
import { FormikProvider, useFormik } from 'formik'
import { TextField } from '../components/input/TextField'

type LoginFormValues = {
	email: string
	password: string
}

export const LoginView = () => {
	const [isLoading, setIsLoading] = useState(false)

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		onSubmit: async ({ email, password }) => {
			setIsLoading(true)

			try {
				await loginUser(email, password)

				window.location.href = '/profile'
			} catch (error: any) {
				console.log(error)
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

	return (
		<>
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<div>
						<TextField
							id="email"
							name="email"
							placeholder="Email"
							type="email"
							label="Email"
							className="mb-2"
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

					<button disabled={isLoading} type="submit">
						Submit
					</button>
				</form>
			</FormikProvider>

			<div>
				No account yet?{' '}
				<a className="underline text-blue-500" href="/register">
					Create an account!
				</a>
			</div>
		</>
	)
}
