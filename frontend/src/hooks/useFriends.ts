import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendFriendInvite } from '../api/friends'

export const useInviteFriends = () => {
	const queryClient = useQueryClient()

	const {
		mutate: sendInvite,
		isPending,
		isError,
	} = useMutation({
		mutationFn: (receiverId: string) => {
			return sendFriendInvite(receiverId)
		},
		onSuccess: (newFriendship, variables, context) => {
			queryClient.setQueryData(
				['profiles', context.receiverId],
				(oldProfile) => {
					return {
						...oldProfile,
						newFriendship,
					}
				},
			)
		},
	})

	return {
		sendInvite,
		isPending,
		isError,
	}
}
