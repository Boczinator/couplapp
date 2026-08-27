import { client } from './client'

export const getInbox = async () => {
	try {
		const inbox = await client.get('conversations')

		return inbox.json()
	} catch (error) {
		console.log(error)
	}
}

export const getConversationMessages = async (conversationId: string) => {
	try {
		const inbox = await client.get(`conversations/${conversationId}/messages`)

		return inbox.json()
	} catch (error) {
		console.log(error)
	}
}

export const getConversationDetails = async (conversationId: string) => {
	try {
		const inbox = await client.get(`conversations/${conversationId}/details`)

		return inbox.json()
	} catch (error) {
		console.log(error)
	}
}
