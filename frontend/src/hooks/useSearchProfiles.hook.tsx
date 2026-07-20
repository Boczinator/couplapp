import { useQuery } from '@tanstack/react-query'
import { searchProfiles, type Profile } from '../api/search'

export const useSearchProfiles = (query: string) => {
	return useQuery<Profile[]>({
		queryKey: ['profiles', 'search', query],
		queryFn: () => searchProfiles(query),
		enabled: !!query && query !== '',
	})
}
