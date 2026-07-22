import { client } from './client'

export type CreateUserInput = {
	email: string
	firstName: string
	lastName: string
	password: string
}

export const registerUser = async (input: CreateUserInput) => {
	try {
		const user = await client.post('/accounts/register', {
			json: input,
		})

		if (user) {
			return await user.json()
		}
	} catch (error) {
		console.log(error)
		throw new Error('Problem with registration')
	}
}

export const verifyRegisterToken = async (token: string) => {
	try {
		const response = await client.post('auth/verify-registration-token', {
			json: {
				token,
			},
		})

		if (response) {
			return await response.json()
		}
	} catch (error) {
		console.log(error)
	}
}
