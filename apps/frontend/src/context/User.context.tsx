import { createContext, useMemo } from 'react' // 1. Import useMemo
import { useAuthUser } from '../hooks/useAuthUser'

export const UserContext = createContext(null) // 2. Export this

export const UserProvider = (props) => {
	const { data: user, isLoading } = useAuthUser()

	const contextValue = useMemo(
		() => ({
			user: user ?? null,
			isLoading,
		}),
		[user, isLoading],
	)

	return <UserContext.Provider value={contextValue} {...props} />
}
