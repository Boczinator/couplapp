import { useEffect, useState } from 'react'

export const useDebounce = (term: string, delay: number = 400) => {
	const [debouncedTerm, setDebouncedTerm] = useState('')

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedTerm(term)
		}, delay)

		return () => clearTimeout(timeoutId)
	}, [term])

	return {
		debouncedTerm,
	}
}
