import { Post } from './Post'

export const PostsList = ({ posts }) => {
	return (
		<div>
			{posts &&
				posts?.posts.length > 0 &&
				posts.posts?.map((post) => (
					<Post
						text={post.text}
						userName={post?.author?.name}
						userPicture={post?.author?.picture}
					/>
				))}
		</div>
	)
}
