import { client } from './client'

export type PostPayload = {
	text: string
}

export type PostResponse = {
	isOwner: boolean
	posts: Post[]
}

export type Post = {
	id: string
	author: {
		id: string
		name: string
		picture: string
	}
	text: string
	createdAt: Date
	updatedAt: Date
}

export const createPost = async (post: PostPayload) => {
	try {
		const result = await client.post('posts/create', {
			json: post,
		})

		return await result.json()
	} catch (error) {
		console.error(error)
	}
}

export const getPostsByProfileId = async (
	profileId: string,
): Promise<PostResponse> => {
	try {
		const posts = await client.get(`posts/${profileId}`)

		return posts.json()
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const removePost = async (postId: string) => {
	try {
		const result = await client.delete(`posts/${postId}`)

		return result.json()
	} catch (error) {
		console.error(error)
	}
}
