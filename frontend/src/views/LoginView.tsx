import { useState } from 'react'
import { loginUser, getUserMe } from '../api/auth'
import { useNavigate } from '@tanstack/react-router'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const navigate = useNavigate()

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault()

		setIsLoading(true)

		try {
			await loginUser(email, password)

			window.location.href = '/profile'
		} catch (error: any) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleTestClick = async () => {
		try {
			await getUserMe()
		} catch (error) {
			console.log(error)
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
						type="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
					></input>
				</div>

				{error && <p>{error}</p>}

				<button disabled={isLoading} type="submit">
					Submit
				</button>
			</form>

			<button onClick={handleTestClick}>Test </button>

			<div>
				No account yet? <a href="/register">Create an account!</a>
			</div>
		</>
	)
}

export default App
