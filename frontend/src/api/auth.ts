import { client } from './client'

export const authenticateUser = async (email: string, password: string) =>
	await client.post('/auth/login', {
		json: {
			email,
			password,
		},
	})
