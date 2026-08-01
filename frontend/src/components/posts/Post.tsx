import { twMerge } from 'tailwind-merge'
import { ProfileCard } from '../card/ProfileCard'
import { formatDate } from '../../helpers/date'
import { Button } from '../button/Button'
import { useState } from 'react'
import { useRemovePost } from '../../hooks/usePosts'

type PostProps = {
	id: string
	text: string
	createdAt: Date
	updatedAt: Date
	authorName: string
	authorPicture: string
	isOwner: boolean
} & React.ComponentPropsWithoutRef<'div'>

export const Post = ({
	id,
	text,
	authorName,
	authorPicture,
	updatedAt,
	createdAt,
	isOwner,
	className,
}: PostProps) => {
	const [isOptionsOpen, setIsOptionsOpen] = useState(false)

	const { mutate: removePost } = useRemovePost()

	const toggleOptions = () => {
		setIsOptionsOpen(!isOptionsOpen)
	}

	return (
		<div className={twMerge('bg-[#D1F5F0] px-5 py-5', className)}>
			<div className="flex items-center justify-between mb-2.5">
				<ProfileCard name={authorName} image={authorPicture} />
				<div>
					{formatDate(new Date(createdAt))}{' '}
					{updatedAt && <span>`(edited at ${formatDate(updatedAt)})`</span>}
				</div>
			</div>
			<div className="rounded-xl px-2.5 py-2.5 bg-white">{text}</div>
			{isOwner && (
				<div className="relative flex flex-wrap justify-end">
					<div
						className="text-4xl text-black text-right cursor-pointer inline-block"
						onClick={toggleOptions}
					>
						...
					</div>

					{isOptionsOpen && (
						<div className="absolute bottom-0 translate-y-full bg-white p-2.5 flex flex-col gap-2.5 shadow-mauve-500 shadow-md right-0">
							<Button className="px-5">Edit</Button>
							<Button
								className="px-5 bg-red-300"
								variant="red"
								onClick={() => removePost(id)}
							>
								Remove
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
