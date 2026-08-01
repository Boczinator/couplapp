import { useProfilePosts } from '../../hooks/usePosts'
import { PostsList } from './PostsList'

export const ProfilePosts = ({ profileId }: { profileId: string }) => {
	const { data, isPending } = useProfilePosts(profileId)

	if (isPending) return <div>Fetching profile posts...</div>

	return <PostsList posts={data.posts} isOwner={data.isOwner} />
}
