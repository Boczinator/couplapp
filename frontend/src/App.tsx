import { useState } from 'react'
import './App.css'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault()

		console.log(email)
		try {
			const response = await fetch('http://localhost:3000/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
				credentials: 'include',
			})
		} catch (error: any) {
			console.log(error.response.data)
			setError(error)
		}
	}
	return (
		<>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: '20px' }}>
					<label htmlFor="email">Email</label>
					<input
						type="text"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
					></input>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="text"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
					></input>
				</div>

				{error && <p>{error}</p>}

				<button type="submit">Submit</button>
			</form>
		</>
	)
}

export default App
