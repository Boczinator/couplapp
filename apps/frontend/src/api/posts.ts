import { client } from './client'

export type PostPayload = {
	text: string
}

export type PostResponse = {
	posts: Post[]
}

export type Author = {
	id: string
	name: string
	picture: string
}

export type Receiver = {
	id: string
	name: string
	picture: string
}

export type Post = {
	id: string
	author: {
		id: string
		name: string
		picture: string
	}
	receiver: {
		id: string
		name: string
		picture: string
	}
	text: string
	createdAt: Date
	updatedAt: Date
}

export const createPost = async (post: PostPayload, receiverId: string) => {
	console.log({ post, receiverId })
	try {
		const result = await client.post('posts/create', {
			json: { ...post, receiverId },
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

export const updatePost = async (postId: string, post: PostPayload) => {
	try {
		const result = await client.patch(`posts/${postId}`, {
			json: post,
		})

		return result.json()
	} catch (error) {
		console.log(error)
	}
}
