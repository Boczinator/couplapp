import { client } from './client'

export type Profile = {
	id: string
	name: string
	bio: string
	picture: string
	pictureBanner: string
	location: string
}

export const searchProfiles = async (query: string): Promise<Profile[]> => {
	try {
		const result = await client.get<Profile[]>('profiles/search', {
			searchParams: {
				query,
			},
		})

		return await result.json()
	} catch (error) {
		console.log(error)

		return []
	}
}
