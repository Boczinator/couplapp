import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	createPost,
	getPostsByProfileId,
	removePost,
	type PostPayload,
} from '../api/posts'
import { useAuthUser } from './useAuthUser'
import { useToast } from '../components/toast/ToastContext'

export const useProfilePosts = (profileId: string) => {
	return useQuery({
		queryKey: ['profiles', 'posts', profileId],
		queryFn: () => getPostsByProfileId(profileId),
	})
}

export const useCreatePost = () => {
	const {
		user: { activeProfileId },
	} = useAuthUser()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			post,
			receiverId,
		}: {
			post: PostPayload
			receiverId: string
		}) => createPost(post, receiverId),
		onSuccess: (_, { receiverId }) => {
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'posts', activeProfileId],
			})

			queryClient.invalidateQueries({
				queryKey: ['profiles', 'posts', receiverId],
			})
		},
	})
}

export const useRemovePost = (currentProfile: string) => {
	const {
		user: { activeProfileId },
	} = useAuthUser()
	const queryClient = useQueryClient()
	const { addToast } = useToast()

	return useMutation({
		mutationFn: (postId: string) => removePost(postId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'posts', activeProfileId],
			})

			if (currentProfile !== activeProfileId) {
				queryClient.invalidateQueries({
					queryKey: ['profiles', 'posts', currentProfile],
				})
			}

			addToast({
				type: 'success',
				message: 'Post successfully removed',
			})
		},
	})
}
