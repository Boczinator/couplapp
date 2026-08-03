import { useEffect, useRef } from 'react'
import { useRemovePost } from '../../hooks/usePosts'
import { Button } from '../button/Button'
import { useOutsideClick } from '../../hooks/useOutsideClick'

type PostEditDropdown = {
	id: string
	profileId: string
	isOpen: boolean
	onClose: () => void
	onEditClick: () => void
}

export const PostEditDropdown = ({
	id,
	profileId,
	isOpen,
	onClose,
	onEditClick,
}: PostEditDropdown) => {
	const { mutate: removePost } = useRemovePost(profileId)

	const elementRef = useRef(null)

	useOutsideClick(elementRef, () => {
		onClose()
	})

	return (
		isOpen && (
			<div
				ref={elementRef}
				className="absolute bottom-0 translate-y-full bg-white p-2.5 flex flex-col gap-2.5 shadow-mauve-500 shadow-md right-0"
			>
				<Button className="px-5" onClick={onEditClick}>
					Edit
				</Button>
				<Button
					className="px-5 bg-red-300"
					variant="red"
					onClick={() => removePost(id)}
				>
					Remove
				</Button>
			</div>
		)
	)
}
