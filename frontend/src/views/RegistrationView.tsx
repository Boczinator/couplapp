import { useState } from 'react'
import { useRegister } from '../hooks/useRegister.hook'
import { FormikProvider, useFormik } from 'formik'
import { TextField } from '../components/input/TextField'

type RegistrationFormValues = {
	email: string
	name: string
	password: string
	passwordVerify: string
}

export const RegistrationView = () => {
	const { register } = useRegister()

	const formik = useFormik({
		initialValues: {
			email: '',
			name: '',
			password: '',
			passwordVerify: '',
		},
		onSubmit: async ({ email, name, password }) => {
			register({
				email,
				name,
				password,
			})
		},
		validate: (values) => {
			const errors: Partial<RegistrationFormValues> = {}

			if (!values.password) {
				errors.password = 'Required field'
			}

			if (!values.email) {
				errors.email = 'Required field'
			}

			if (!values.name) {
				errors.name = 'Required field'
			}

			if (!values.passwordVerify) {
				errors.passwordVerify = 'Required field'
			}

			if (values.password !== values.passwordVerify) {
				errors.password = 'Passwords do not match'
			}
		},
	})

	return (
		<FormikProvider value={formik}>
			<form onSubmit={formik.handleSubmit}>
				<div>
					<TextField
						name="email"
						type="email"
						id="email"
						label="Email"
						placeholder="Email"
					/>
				</div>
				<div>
					<TextField
						name="name"
						type="text"
						id="name"
						label="Name"
						placeholder="Name"
					/>
				</div>
				<fieldset className="flex flex-col">
					<TextField
						name="password"
						type="password"
						id="password"
						label="Password"
						placeholder="Password"
					/>

					<TextField
						name="passwordVerify"
						type="password"
						id="passwordVerify"
						label="Verify Password"
						placeholder="Verify Password"
					/>
				</fieldset>

				<button type="submit">Register</button>
			</form>
		</FormikProvider>
	)
}
