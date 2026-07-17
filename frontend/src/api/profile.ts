import { client } from './client'

/**
 * Update profile information.
 * @param {string} id - Id of profile
 */
export const updateProfile = async (profile) => {
	try {
		const profile = await client.patch('profiles/')

		return await profile.json()
	} catch (error) {
		console.log(error)
	}
}

export const getProfileOverview = async () => {
	try {
		const profile = await client.get('profiles/overview')

		return await profile.json()
	} catch (error) {
		console.log(error)
	}
}
