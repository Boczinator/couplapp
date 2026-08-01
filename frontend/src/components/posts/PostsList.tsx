import type { Post as PostType } from '../../api/posts'
import { Post } from './Post'

type PostListProps = {
	posts: PostType[]
	isOwner: boolean
}

export const PostsList = ({ posts, isOwner }: PostListProps) => {
	return (
		<div className="flex flex-col gap-8">
			{posts &&
				posts?.length > 0 &&
				posts?.map((post) => (
					<Post
						key={post.id}
						id={post.id}
						text={post.text}
						authorName={post?.author?.name}
						authorPicture={post?.author?.picture}
						createdAt={post?.createdAt}
						updatedAt={post?.updatedAt}
						isOwner={isOwner}
					/>
				))}
		</div>
	)
}
