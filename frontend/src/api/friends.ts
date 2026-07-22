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
