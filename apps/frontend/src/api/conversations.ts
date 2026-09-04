import { components } from '@couplapp/shared'
import { client } from './client'

export const getInbox = async (): Promise<
	components['schemas']['InboxConversationDto'][]
> => {
	try {
		const inbox = await client.get('conversations')

		return inbox.json()
	} catch (error) {
		throw error
	}
}

export const getConversationMessages = async (
	conversationId: string,
): Promise<components['schemas']['ChatMessageWithSenderDto'][]> => {
	try {
		const inbox = await client.get(`conversations/${conversationId}/messages`)

		return inbox.json()
	} catch (error) {
		throw error
	}
}

export const getConversationDetails = async (
	conversationId: string,
): Promise<components['schemas']['ConversationDto']> => {
	try {
		const inbox = await client.get(`conversations/${conversationId}/details`)

		return inbox.json()
	} catch (error) {
		throw error
	}
}

export const markConversationAsRead = async (conversationId: string) => {
	try {
		const result = await client.patch(`conversations/${conversationId}/read`)

		return await result.json()
	} catch (error) {
		throw error
	}
}
