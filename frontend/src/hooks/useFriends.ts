import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	acceptFriendRequest,
	getAllRequests,
	getFriends,
	removeRelation,
	sendFriendInvite,
} from '../api/friends'

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
		onSuccess: (_, receiverId) => {
			queryClient.invalidateQueries({ queryKey: ['profile', receiverId] })
		},
	})

	return {
		sendInvite,
		isPending,
		isError,
	}
}

export const useRemoveRelationship = () => {
	const queryClient = useQueryClient()

	const {
		mutate: removeRelationship,
		isPending,
		isError,
	} = useMutation({
		mutationFn: (receiverId: string) => {
			return removeRelation(receiverId)
		},
		onSuccess: (_, receiverId) => {
			queryClient.invalidateQueries({ queryKey: ['profile', receiverId] })
		},
	})

	return {
		removeRelationship,
		isPending,
		isError,
	}
}

export const useAcceptFriendRequest = () => {
	const queryClient = useQueryClient()
	const {
		mutate: acceptRequest,
		isPending,
		isError,
	} = useMutation({
		mutationFn: (requesterId: string) => {
			return acceptFriendRequest(requesterId)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['friends'],
			})
		},
	})

	return {
		acceptRequest,
		isPending,
		isError,
	}
}

export const useFriendRequests = (profileId: string) => {
	const {
		data: friendRequests,
		isPending,
		isError,
	} = useQuery({
		queryKey: ['friends', 'requests', profileId],
		queryFn: () => {
			return getAllRequests()
		},
	})

	return {
		friendRequests,
		isError,
		isPending,
	}
}

export const useFriendsList = (profileId: string) => {
	const {
		data: friends,
		isPending,
		isError,
	} = useQuery({
		queryKey: ['friends', 'list', profileId],
		queryFn: () => {
			return getFriends()
		},
	})

	return {
		friends,
		isError,
		isPending,
	}
}
