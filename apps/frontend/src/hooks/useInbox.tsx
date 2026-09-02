import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getConversationDetails,
	getConversationMessages,
	getInbox,
	markConversationAsRead,
} from '../api/conversations'
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

export const useConversationMessages = (conversationId: string) => {
	return useQuery({
		queryKey: ['messages', conversationId],
		queryFn: () => getConversationMessages(conversationId),
		enabled: !!conversationId,
	})
}

export const useConversationDetails = (conversationId: string) => {
	return useQuery({
		queryKey: ['conversation-details', conversationId],
		queryFn: () => getConversationDetails(conversationId),
		enabled: !!conversationId,
	})
}

export const useMarkConversationAsRead = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (conversationId: string) =>
			markConversationAsRead(conversationId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['inbox'],
			})
		},
	})
}
