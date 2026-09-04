import { client } from './client'
import type { Profile } from './types'
import type { components } from '@couplapp/shared'
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
		throw error
	}
}

export const getProfileOverview = async (): Promise<
	components['schemas']['LightProfileResponseDto'][]
> => {
	try {
		const profiles = await client.get('profiles/overview')

		return await profiles.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getProfile = async (
	profileId: string,
): Promise<components['schemas']['ProfileResponseDto']> => {
	try {
		const profile = await client.get(`profiles/${profileId}`, {
			searchParams: {
				includes: 'friends',
			},
		})

		return await profile.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const switchProfile = async (
	profileId: string,
): Promise<components['schemas']['ProfileDto']> => {
	try {
		const profile = await client.patch(`accounts/profiles/switch/${profileId}`)

		return await profile.json()
	} catch (error) {
		throw error
	}
}

export const createProfile = async (
	profile: Profile,
): Promise<components['schemas']['ProfileDto']> => {
	try {
		const createdProfile = await client.post('accounts/profiles/create', {
			json: profile,
		})

		return await createdProfile.json()
	} catch (error) {
		throw error
	}
}

export const updateProfilePicture = async (file: File) => {
	try {
		const formData = new FormData()
		formData.append('file', file)

		const result = await client.patch('profiles/avatar', {
			body: formData,
		})

		return await result.json()
	} catch (error) {
		throw error
	}
}
