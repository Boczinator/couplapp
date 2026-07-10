import { useState } from 'react'
import { useRegister } from '../hooks/useRegister.hook'

export const RegistrationView = () => {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [passwordVerify, setPasswordVerify] = useState('')
	const [error, setError] = useState('')

	const { register, isPending } = useRegister()

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault()
		setError('')

		if (password !== passwordVerify) {
			setError('Passwords do not match!')

			return
		}

		register({
			email,
			name,
			password,
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="email">Your email</label>
				<input
					type="email"
					id="email"
					onChange={(event) => setEmail(event.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="name">Your name</label>
				<input
					type="text"
					id="name"
					onChange={(event) => setName(event.target.value)}
				/>
			</div>
			<fieldset>
				<label htmlFor="password">Password</label>
				<input
					type="text"
					id="password"
					onChange={(event) => setPassword(event.target.value)}
				/>

				<label htmlFor="password">Confirm Password</label>
				<input
					type="text"
					id="password"
					onChange={(event) => setPasswordVerify(event.target.value)}
				/>
			</fieldset>

			<button type="submit">Register</button>

			{error && <div>{error}</div>}
		</form>
	)
}
