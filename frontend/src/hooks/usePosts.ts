import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, getPostsByProfileId, type PostPayload } from '../api/posts'
import { useAuthUser } from './useAuthUser'

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
		onSuccess: (post) => {
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'posts', activeProfileId],
			})
		},
	})
}
