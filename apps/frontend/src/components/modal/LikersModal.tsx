import type React from 'react'
import { useState } from 'react'
import { Modal } from './Modal'
import { useProfilesByPostLikes } from '@/hooks/usePosts'
import { Link } from '@tanstack/react-router'

interface PostLikersModalProps {
	postId: string
	trigger: React.ReactElement
}

export const PostLikersModal = ({ postId, trigger }: PostLikersModalProps) => {
	const [isOpen, setIsOpen] = useState(false)

	const {
		data: likers,
		isLoading,
		error,
	} = useProfilesByPostLikes(postId, isOpen)

	return (
		<Modal
			open={isOpen}
			onOpenChange={setIsOpen}
			trigger={trigger}
			title="Likes"
			className="sm:max-w-sm max-h-[400px] flex flex-col"
		>
			{/* Scrollable Container Box for the Likers List */}
			<div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
				{isLoading && (
					<div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
						Loading profiles...
					</div>
				)}

				{error && (
					<div className="text-sm text-destructive text-center py-4">
						Failed to load likers.
					</div>
				)}

				{!isLoading && !error && likers?.length === 0 && (
					<div className="text-sm text-muted-foreground text-center py-8">
						No likes yet.
					</div>
				)}

				{!isLoading &&
					!error &&
					likers?.map((profile) => (
						<Link
							to="/profile/$profileId"
							params={{ profileId: profile.id }}
							key={profile.id}
							className="flex items-center gap-3 py-1"
						>
							<img
								src={profile.picture ?? '/default-avatar.png'}
								alt={profile.name}
								className="w-10 h-10 rounded-full object-cover border"
							/>
							<div className="flex flex-col">
								<span className="text-sm font-medium">{profile.name}</span>
							</div>
						</Link>
					))}
			</div>
		</Modal>
	)
}
