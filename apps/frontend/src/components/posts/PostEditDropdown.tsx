import { useRef } from 'react'
import { useRemovePost } from '../../hooks/usePosts'
import { useOutsideClick } from '../../hooks/useOutsideClick'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

import { Button } from '../ui/button'

type PostEditDropdown = {
	id: string
	profileId: string
	onEditClick: () => void
}

export const PostEditDropdown = ({
	id,
	profileId,
	onEditClick,
}: PostEditDropdown) => {
	const { mutate: removePost } = useRemovePost(profileId)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				...
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Current Post</DropdownMenuLabel>
					<DropdownMenuItem onClick={onEditClick}>Edit</DropdownMenuItem>
					<DropdownMenuItem onClick={() => removePost(id)}>
						Remove
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
