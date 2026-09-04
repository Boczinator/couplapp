import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getConversationDetails,
	getConversationMessages,
	getInbox,
	markConversationAsRead,
} from '../api/conversations'
import { useActiveProfileId } from './useAuthUser'

export const useInbox = () => {
	const activeProfileId = useActiveProfileId()

	return useQuery({
		queryKey: ['inbox', activeProfileId],
		queryFn: () => getInbox(),
	})
}

export const useConversationMessages = (conversationId: string | null) => {
	return useQuery({
		queryKey: ['messages', conversationId],
		queryFn: () => getConversationMessages(conversationId!),
		enabled: !!conversationId,
	})
}

export const useConversationDetails = (conversationId?: string | null) => {
	return useQuery({
		queryKey: ['conversation-details', conversationId],
		queryFn: () => getConversationDetails(conversationId!),
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
