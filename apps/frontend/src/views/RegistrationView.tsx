import { useRegister } from '../hooks/useRegister'
import { FormikProvider, useFormik } from 'formik'
import { TextField } from '../components/input/TextField'
import { Button } from '../components/button/Button'
import z from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const registrationSchema = z
	.object({
		firstName: z.string({
			error: (field) =>
				field.input === undefined ? 'Field is required' : null,
		}),
		lastName: z.string({
			error: (field) =>
				field.input === undefined ? 'Field is required' : null,
		}),
		email: z.email('Invalid email address'),
		password: z
			.string({
				error: (field) =>
					field.input === undefined ? 'Field is required' : null,
			})
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number')
			.regex(
				/[^A-Za-z0-9]/,
				'Password must contain at least one special character',
			),
		passwordVerify: z.string({
			error: (field) =>
				field.input === undefined ? 'Field is required' : null,
		}),
	})
	.refine((data) => data.password === data.passwordVerify, {
		message: "Passwords don't match",
		path: ['passwordVerify'],
	})

type RegistrationFormValues = z.infer<typeof registrationSchema>

export const RegistrationView = () => {
	const { register, error, isError } = useRegister()

	const formik = useFormik<RegistrationFormValues>({
		initialValues: {
			email: '',
			firstName: '',
			lastName: '',
			password: '',
			passwordVerify: '',
		},
		validationSchema: toFormikValidationSchema(registrationSchema),
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
