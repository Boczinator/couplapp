import { useQuery } from '@tanstack/react-query'
import { getFeed } from '../api/feed'

export const useFeed = () => {
	return useQuery({
		queryKey: ['feed'],
		queryFn: () => getFeed(),
	})
}
