import type { Post as PostType } from '../../api/posts'
import { Post } from './Post'

type PostListProps = {
	posts: PostType[]
}

export const PostsList = ({ posts }: PostListProps) => {
	return (
		<div className="flex flex-col gap-8">
			{posts &&
				posts?.length > 0 &&
				posts?.map((post) => (
					<Post
						key={post.id}
						id={post.id}
						text={post.text}
						author={post?.author}
						receiver={post?.receiver}
						createdAt={post?.createdAt}
						updatedAt={post?.updatedAt}
						likesCount={post?.likesCount}
						isLiked={post?.isLiked}
					/>
				))}
		</div>
	)
}
