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
		mutationFn: (post: PostPayload) => createPost(post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'posts', activeProfileId],
			})
		},
	})
}

export const useRemovePost = () => {
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

			addToast({
				type: 'success',
				message: 'Post successfully removed',
			})
		},
	})
}
