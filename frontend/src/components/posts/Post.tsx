import { twMerge } from 'tailwind-merge'
import { ProfileCard } from '../card/ProfileCard'
import { formatDate } from '../../helpers/date'
import { Button } from '../button/Button'
import { useState } from 'react'
import { useRemovePost } from '../../hooks/usePosts'
import type { Author, Receiver } from '../../api/posts'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useParams } from '@tanstack/react-router'

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
	const {
		user: { activeProfileId },
	} = useAuthUser()

	const params = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const { mutate: removePost } = useRemovePost(params.profileId)

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
						params={{ profileId: author.id }}
					/>
					{receiver.id !== author.id && (
						<>
							<div className="text-lg">posted to</div>
							<ProfileCard
								name={receiver?.name}
								image={receiver?.picture}
								to="/profile/$profileId"
								params={{ profileId: receiver.id }}
							/>
						</>
					)}
				</div>
				<div>
					{formatDate(new Date(createdAt))}{' '}
					{updatedAt && <span>`(edited at ${formatDate(updatedAt)})`</span>}
				</div>
			</div>
			<div className="rounded-xl px-2.5 py-2.5 bg-white">{text}</div>
			{author.id === activeProfileId && (
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
