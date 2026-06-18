import { useState } from 'react'
import './App.css'
import { authenticateUser } from './api/auth'
import { client } from './api/client'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault()

		try {
			const response = await authenticateUser(email, password)
			console.log(response)
		} catch (error: any) {
			console.log(error)
			setError(error)
		}
  }
  
  const handleTestClick = () => {
    try {
      await client.get('me')
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
      
      <button onClick={handleTestClick}>Test </button>
		</>
	)
}

export default App
