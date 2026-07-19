import { client } from './client'
import type { Profile } from './types'

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

export const switchProfile = async (profileId: string) => {
	try {
		const profile = await client.patch(`profiles/switch/${profileId}`)

		return await profile.json()
	} catch (error) {
		console.log(error)
	}
}

export const createProfile = async (profile: Profile) => {
	try {
		const createdProfile = await client.post('profiles', {
			json: profile,
		})

		return await createdProfile.json()
	} catch (error) {
		console.log(error)
	}
}
