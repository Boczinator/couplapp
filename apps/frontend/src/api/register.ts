import { components } from '@couplapp/shared'
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

export const verifyRegisterToken = async (
	token: string,
): Promise<components['schemas']['RegistrationTokenVerificationDto']> => {
	try {
		const response = await client.post('auth/verify-registration-token', {
			json: {
				token,
			},
		})

		return await response.json()
	} catch (error) {
		throw error
	}
}
