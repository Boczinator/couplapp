import { client } from './client'
import type { Post } from './posts'

export type FeedResponse = {
	posts: Post[]
}

export const getFeed = async (): Promise<FeedResponse> => {
	try {
		const feed = await client.get('feed')

		return feed.json()
	} catch (error) {
		console.log(error)
		throw error
	}
}
