import { components } from '@couplapp/shared'
import { client } from './client'

export const sendFriendInvite = async (receiverId: string) => {
	try {
		const result = await client.post('friends/invite', {
			json: {
				receiverId,
			},
		})

		if (!result.ok) {
			throw new Error(`Failed to send invite: ${result.statusText}`)
		}

		return await result.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const removeRelation = async (receiverId: string) => {
	try {
		const result = await client.delete(`friends/remove/${receiverId}`)

		if (!result.ok) {
			throw new Error(`Failed to remove relation: ${result.statusText}`)
		}

		return await result.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getAllRequests = async () => {
	try {
		const result = await client.get(`friends/requests`)

		if (!result.ok) {
			throw new Error(`Failed to fetch requests: ${result.statusText}`)
		}

		return await result.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const acceptFriendRequest = async (requesterId: string) => {
	try {
		const result = await client.patch(`friends/accept/${requesterId}`)

		if (!result.ok) {
			throw new Error(`Failed to accept requests: ${result.statusText}`)
		}

		return await result.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}

export const getFriends = async (
	profileId: string,
): Promise<components['schemas']['ProfileDto'][]> => {
	try {
		const result = await client.get(`friends/${profileId}`)

		if (!result.ok) {
			throw new Error(`Failed to accept requests: ${result.statusText}`)
		}

		return await result.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}
