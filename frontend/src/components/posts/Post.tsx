import { twMerge } from 'tailwind-merge'
import { ProfileCard } from '../card/ProfileCard'
import { formatDate } from '../../helpers/date'
import { useState } from 'react'
import type { Author, Receiver } from '../../api/posts'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useParams } from '@tanstack/react-router'
import { PostEditDropdown } from './PostEditDropdown'
import { EditPostForm } from '../form/EditPostForm'

type PostProps = {
	id: string
	text: string
	createdAt: Date
	updatedAt: Date
	author: Author
	receiver: Receiver
} & React.ComponentPropsWithoutRef<'div'>

export const Post = ({
	id,
	text,
	author,
	receiver,
	updatedAt,
	createdAt,
	className,
}: PostProps) => {
	const [isOptionsOpen, setIsOptionsOpen] = useState(false)
	const [isEditFormOpen, setIsEditFormOpen] = useState(false)

	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const toggleOptions = () => {
		setIsOptionsOpen(!isOptionsOpen)
	}

	return (
		<div className={twMerge('bg-[#D1F5F0] px-5 py-5', className)}>
			<div className="flex items-center justify-between mb-2.5">
				<div className="flex gap-5 items-center">
					<ProfileCard
						name={author?.name}
						image={author?.picture}
						to="/profile/$profileId"
						params={{ profileId: author?.id }}
					/>
					{receiver.id !== author.id && (
						<>
							<div className="text-lg">posted to</div>
							<ProfileCard
								name={receiver?.name}
								image={receiver?.picture}
								to="/profile/$profileId"
								params={{ profileId: receiver?.id }}
							/>
						</>
					)}
				</div>
				<div>
					{formatDate(new Date(createdAt))}{' '}
					{updatedAt && (
						<span className="text-sm">
							(edited at {formatDate(new Date(updatedAt))})
						</span>
					)}
				</div>
			</div>
			{!isEditFormOpen && (
				<div className="rounded-xl px-2.5 py-2.5 bg-white">{text}</div>
			)}

			{isEditFormOpen && (
				<EditPostForm
					onSuccess={() => setIsEditFormOpen(false)}
					onAbort={() => setIsEditFormOpen(false)}
					postId={id}
					currentProfileId={profileId}
					initialPostText={text}
				/>
			)}

			{author.id === activeProfileId && (
				<div className="relative flex flex-wrap justify-end">
					<div
						className="text-4xl text-black text-right cursor-pointer inline-block"
						onClick={toggleOptions}
					>
						...
					</div>

					<PostEditDropdown
						isOpen={isOptionsOpen}
						id={id}
						profileId={profileId}
						onClose={() => setIsOptionsOpen(false)}
						onEditClick={() => setIsEditFormOpen(true)}
					/>
				</div>
			)}
		</div>
	)
}
