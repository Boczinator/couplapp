import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	createPost,
	getPostsByProfileId,
	getProfilesByPostLikes,
	removePost,
	toggleLikePost,
	updatePost,
	type PostPayload,
} from '../api/posts'
import { useActiveProfileId } from './useAuthUser'
import { useToast } from '../components/toast/ToastContext'

export const useProfilePosts = (profileId: string) => {
	return useQuery({
		queryKey: ['profiles', 'posts', profileId],
		queryFn: () => getPostsByProfileId(profileId),
	})
}

export const useCreatePost = () => {
	const activeProfileId = useActiveProfileId()

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
	const activeProfileId = useActiveProfileId()

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

export const useEditPost = (currentProfileId: string) => {
	const activeProfileId = useActiveProfileId()

	const queryClient = useQueryClient()
	const { addToast } = useToast()

	return useMutation({
		mutationFn: ({ id, post }: { id: string; post: PostPayload }) =>
			updatePost(id, post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['profiles', 'posts', activeProfileId],
			})

			if (currentProfileId !== activeProfileId) {
				queryClient.invalidateQueries({
					queryKey: ['profiles', 'posts', currentProfileId],
				})
			}

			addToast({
				type: 'success',
				message: 'Post successfully updated',
			})
		},
	})
}

export const useLikeTogglePost = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (postId: string) => toggleLikePost(postId),
		onSuccess: (data) => {
			const updatePostList = (oldData: any) => {
				if (!oldData) return oldData
				return {
					...oldData,
					posts: oldData.posts.map((post: any) =>
						post.id === data.postId
							? {
									...post,
									isLiked: data.isLiked,
									likesCount: post.likesCount + data.likesCountDelta,
								}
							: post,
					),
				}
			}

			queryClient.setQueryData(['feed'], updatePostList)

			queryClient.setQueriesData(
				{ queryKey: ['profiles', 'posts'] },
				updatePostList,
			)
		},
	})
}

export const useProfilesByPostLikes = (postId: string, enabled: boolean) => {
	return useQuery({
		queryKey: ['posts', postId, 'likers'],
		queryFn: () => getProfilesByPostLikes(postId),
		enabled: !!postId && enabled,
	})
}
