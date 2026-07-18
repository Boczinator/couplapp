import { useQuery } from '@tanstack/react-query'
import { getProfileOverview } from '../api/profile'

export const useProfileOverview = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['profile-overview'],
		queryFn: async () => {
			return getProfileOverview()
		},
	})

	return {
		profiles: data,
		isLoading,
	}
}
