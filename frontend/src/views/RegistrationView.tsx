import { useRegister } from '../hooks/useRegister.hook'
import { FormikProvider, useFormik } from 'formik'
import { TextField } from '../components/input/TextField'
import { Button } from '../components/button/Button'

type RegistrationFormValues = {
	email: string
	firstName: string
	lastName: string
	password: string
	passwordVerify: string
}

export const RegistrationView = () => {
	const { register, error, isError } = useRegister()

	const formik = useFormik({
		initialValues: {
			email: '',
			firstName: '',
			lastName: '',
			password: '',
			passwordVerify: '',
		},
		onSubmit: async (
			{ email, firstName, lastName, password },
			{ setSubmitting },
		) => {
			register(
				{
					email,
					firstName,
					lastName,
					password,
				},
				{
					onSettled: () => setSubmitting(false),
				},
			)
		},
		validate: (values) => {
			const errors: Partial<RegistrationFormValues> = {}

			if (!values.password) {
				errors.password = 'Required field'
			}

			if (!values.email) {
				errors.email = 'Required field'
			}

			if (!values.firstName) {
				errors.firstName = 'Required field'
			}

			if (!values.lastName) {
				errors.lastName = 'Required field'
			}

			if (!values.passwordVerify) {
				errors.passwordVerify = 'Required field'
			}

			if (values.password !== values.passwordVerify) {
				errors.password = 'Passwords do not match'

				/* addToast({
					id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
					message: 'Passwords do not match!',
					type: ToastTypes.Error,
				}) */
			}

			return errors
		},
	})

	return (
		<div>
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
							name="firstName"
							type="text"
							id="firstName"
							label="First name"
							placeholder="First name"
						/>
					</div>
					<div>
						<TextField
							name="lastName"
							type="text"
							id="lastName"
							label="Last name"
							placeholder="Last name"
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

					<Button className="mb-10" type="submit">
						Register
					</Button>
				</form>
			</FormikProvider>
		</div>
	)
}
