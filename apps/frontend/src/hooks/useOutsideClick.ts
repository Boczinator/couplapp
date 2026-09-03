import { useEffect } from 'react'

export const useOutsideClick = (
	ref: React.RefObject<HTMLElement | null>,
	onOutsideClick: () => void,
) => {
	useEffect(() => {
		const handleClick = (event: Event) => {
			if (ref.current && !ref.current?.contains(event.target as Node)) {
				onOutsideClick()
			}
		}

		globalThis.addEventListener('click', handleClick, true)

		return () => globalThis.removeEventListener('click', handleClick, true)
	}, [ref])
}
