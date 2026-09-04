import { twMerge } from 'tailwind-merge'
import { ProfileCard } from '../card/ProfileCard'
import { formatDate } from '../../helpers/date'
import { useState } from 'react'
import type { Author, Receiver } from '../../api/posts'
import { useActiveProfileId } from '../../hooks/useAuthUser'
import { useParams } from '@tanstack/react-router'
import { PostEditDropdown } from './PostEditDropdown'
import { EditPostForm } from '../form/EditPostForm'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'

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
	const [isEditFormOpen, setIsEditFormOpen] = useState(false)

	const activeProfileId = useActiveProfileId()

	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const { date: createdAtDate, time: createdAtTime } = formatDate(
		new Date(createdAt),
	)

	const { date: updatedAtDate } = formatDate(new Date(updatedAt))

	return (
		<Card className={twMerge(className)}>
			<CardHeader>
				<CardTitle>
					<div className="flex gap-5 items-center">
						<ProfileCard
							name={author?.name}
							image={author?.picture}
							to="/profile/$profileId"
							params={{ profileId: author?.id }}
						/>
						{receiver.id !== author.id && (
							<>
								<div className="text-sm">{`=>`}</div>
								<ProfileCard
									name={receiver?.name}
									image={receiver?.picture}
									to="/profile/$profileId"
									params={{ profileId: receiver?.id }}
								/>
							</>
						)}
					</div>
				</CardTitle>
				<CardDescription>
					<div>
						{createdAtDate} {createdAtTime}
						{updatedAt && (
							<span className="text-sm pl-2">(edited at {updatedAtDate})</span>
						)}
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent>
				{!isEditFormOpen && (
					<div className="rounded-xl px-2.5 py-2.5 bg-secondary">{text}</div>
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
			</CardContent>
			{author.id === activeProfileId && (
				<CardFooter>
					<div className="relative flex flex-wrap justify-end">
						<PostEditDropdown
							id={id}
							profileId={profileId}
							onEditClick={() => setIsEditFormOpen(true)}
						/>
					</div>
				</CardFooter>
			)}
		</Card>
	)
}
