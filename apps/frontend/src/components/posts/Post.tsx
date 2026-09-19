import { twMerge } from 'tailwind-merge'
import { ProfileCard } from '../card/ProfileCard'
import { formatDate } from '../../helpers/date'
import { useState } from 'react'
import { type Author, type Receiver } from '../../api/posts'
import { useActiveProfileId } from '../../hooks/useAuthUser'
import { useParams } from '@tanstack/react-router'
import { PostEditDropdown } from './PostEditDropdown'
import { EditPostForm } from '../form/EditPostForm'
import ThumbUp from '../../assets/icons/thumb-up.svg'
import ThumbUpWhite from '../../assets/icons/thumb-up-white.svg'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { useLikeTogglePost } from '@/hooks/usePosts'
import { Button } from '../ui/button'

type PostProps = {
	id: string
	text: string
	createdAt: Date
	updatedAt: Date
	author: Author
	receiver: Receiver
	isLiked: boolean
	likesCount: number
} & React.ComponentPropsWithoutRef<'div'>

export const Post = ({
	id,
	text,
	author,
	receiver,
	updatedAt,
	createdAt,
	className,
	isLiked,
	likesCount,
}: PostProps) => {
	const [isEditFormOpen, setIsEditFormOpen] = useState(false)

	const activeProfileId = useActiveProfileId()

	const { mutate: likeTogglePost } = useLikeTogglePost()

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

				<div className="pt-2.5 flex text-sm items-center gap-2">
					<Button
						onClick={() => likeTogglePost(id)}
						className="p-1.25"
						variant={isLiked ? 'default' : 'ghost'}
						size="icon-sm"
					>
						<img src={isLiked ? ThumbUpWhite : ThumbUp} />
					</Button>
					<Button variant="ghost" className="p-0">
						{likesCount > 0
							? `${likesCount} ${likesCount > 1 ? 'people' : 'person'} like${likesCount === 1 && 's'} this`
							: likesCount}
					</Button>
				</div>
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
