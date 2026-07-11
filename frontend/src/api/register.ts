import { client } from './client'

export type CreateUserInput = {
	email: string
	name: string
	password: string
}

export const registerUser = async (input: CreateUserInput) => {
	try {
		const user = await client.post('/users/create', {
			json: input,
		})

		if (user) {
			return await user.json()
		}
	} catch (error) {
		throw new Error('Problem with registration')
	}
}
