import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getProfile,
	getProfileOverview,
	switchProfile,
	createProfile as createNewProfile,
	updateProfilePicture,
} from '../api/profile'
import { useNavigate } from '@tanstack/react-router'
import type { Profile } from '../api/types'
import { queryClient } from '../api/queryClient'
import { useAuthUser } from './useAuthUser'
import { useToast } from '../components/toast/ToastContext'

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

export const useSwitchActiveProfile = () => {
	const navigate = useNavigate()

	const { mutate: switchActiveProfile, isPending } = useMutation({
		mutationKey: ['switch-profile'],
		mutationFn: (profileId: string) => {
			return switchProfile(profileId)
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['user-auth'] })
			navigate({
				to: '/profile/$profileId',
				params: {
					profileId: data.id,
				},
			})
		},
	})

	return {
		switchActiveProfile,
		isPending,
	}
}

export const useCreateProfile = () => {
	const navigate = useNavigate()

	const {
		mutate: createProfile,
		isPending,
		isSuccess,
	} = useMutation({
		mutationKey: ['create-profile'],
		mutationFn: (profile: Profile) => {
			return createNewProfile(profile)
		},
		onSuccess: (data) => {
			navigate({
				to: '/profile/$profileId',
				params: {
					profileId: data.id,
				},
			})
		},
	})

	return {
		createProfile,
		isPending,
		isSuccess,
	}
}

export const useProfilePicture = () => {
	const queryClient = useQueryClient()
	const { user } = useAuthUser()
	const { addToast } = useToast()

	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: (file: File) => updateProfilePicture(file),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['profile', user?.activeProfileId],
			})

			queryClient.invalidateQueries({
				queryKey: ['profiles', 'posts', user?.activeProfileId],
			})

			addToast({
				type: 'success',
				message: 'Profile Picture updated successfully',
			})
		},
	})

	return {
		mutate,
		isPending,
		isSuccess,
	}
}
