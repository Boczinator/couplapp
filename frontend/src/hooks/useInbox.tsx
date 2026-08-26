import { useQuery } from '@tanstack/react-query'
import { getConversation, getInbox } from '../api/conversations'
import { useAuthUser } from './useAuthUser'

export const useInbox = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()

	return useQuery({
		queryKey: ['inbox', activeProfileId],
		queryFn: () => getInbox(),
	})
}

export const useConversation = (conversationId: string) => {
	return useQuery({
		queryKey: ['conversation', conversationId],
		queryFn: () => getConversation(conversationId),
		enabled: !!conversationId,
	})
}
