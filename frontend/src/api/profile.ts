import { client } from './client'

/**
 * Update profile information.
 * @param {string} id - Id of profile
 */
export const updateProfile = async (profileId: string) => {
	try {
		const updatedProfile = await client.patch(`profiles/${profileId}`)

		return await updatedProfile.json()
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

export const getProfile = async (profileId: string) => {
	try {
		const profile = await client.get(`profiles/${profileId}`)

		return await profile.json()
	} catch (error) {
		console.log(error)
	}
}
