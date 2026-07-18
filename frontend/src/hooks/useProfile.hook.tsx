import { useMutation, useQuery } from '@tanstack/react-query'
import { getProfile, getProfileOverview } from '../api/profile'

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

export const useCurrentProfile = (profileId: string) => {
	const { data: profile, isLoading } = useQuery({
		queryKey: ['profile', profileId],
		queryFn: () => {
			return getProfile(profileId)
		},
		enabled: !!profileId,
	})

	return {
		profile,
		isLoading,
	}
}

export const useFriendProfile = (profileId: string) => {
	const { data: profile, isLoading } = useQuery({
		queryKey: ['profile', profileId, 'friendId'],
		queryFn: () => {
			return getProfile(profileId)
		},
		enabled: !!profileId,
	})

	return {
		profile,
		isLoading,
	}
}
