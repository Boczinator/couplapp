import { useProfilePosts } from '../../hooks/usePosts'
import { PostsList } from './PostsList'

export const ProfilePosts = ({ profileId }: { profileId: string }) => {
	const { data: posts, isPending } = useProfilePosts(profileId)

	if (isPending) return <div>Fetching profile posts...</div>

	return <PostsList posts={posts} />
}
