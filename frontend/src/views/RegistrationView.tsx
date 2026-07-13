import { useRegister } from '../hooks/useRegister.hook'
import { FormikProvider, useFormik } from 'formik'
import { TextField } from '../components/input/TextField'
import { ToastTypes, useToast } from '../components/toast/ToastContext'

type RegistrationFormValues = {
	email: string
	name: string
	password: string
	passwordVerify: string
}

export const RegistrationView = () => {
	const { register } = useRegister()
	const { addToast } = useToast()

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
		<div className="px-40 max-w-200 mx-auto">
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

					<button
						className="bg-[#7AE2CF] text-[#06202B] px-1.5 py-2 w-full text-bold cursor-pointer mb-10"
						type="submit"
					>
						Register
					</button>
				</form>
			</FormikProvider>
		</div>
	)
}
