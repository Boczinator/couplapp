import { client } from './client'

export const loginUser = async (email: string, password: string) =>
	await client.post('/auth/login', {
		json: {
			email,
			password,
		},
	})

export const logoutUser = async () => {
	try {
		const response = await client.post('/auth/logout')

		return response
	} catch (error) {
		console.log(error)
	}
}

export const getUserMe = async () => {
	try {
		const data = await client.get('/auth/me').json()

		return data
	} catch (error) {
		console.log(error)
	}
}

export const refreshToken = async () => {
	try {
		await client.post('/auth/refresh')
	} catch (error) {
		console.log(error)
	}
}
