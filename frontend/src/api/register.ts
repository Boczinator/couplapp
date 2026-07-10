import { client } from './client'

type CreateUserInput = {
	email: string
	name: string
	password: string
}

export const registerUser = async (input: CreateUserInput) => {
	try {
		const user = await client.post('/users/create', {
			json: input,
		})

		console.log(user)
		if (user) {
			return user.json()
		}
	} catch (error) {
		return error
	}
}
