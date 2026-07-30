import { client } from './client'

type PostPayload = {
	text: string
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

export const getPostsByProfileId = async (profileId: string) => {
	try {
		const posts = await client.get(`posts/${profileId}`)

		return posts.json()
	} catch (error) {
		console.error(error)
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
