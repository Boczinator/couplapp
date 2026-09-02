import { PostsList } from '../components/posts/PostsList'
import { useFeed } from '../hooks/useFeed'

export const FeedView = () => {
	const { data: feedData, isPending } = useFeed()

	if (isPending && !feedData) return <div>Fetching feed data...</div>

	return (
		<div>
			<h2 className="text-2xl text-primary font-bold mb-5">Your Feed</h2>
			{feedData?.posts && <PostsList posts={feedData.posts} />}
		</div>
	)
}
