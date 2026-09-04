import { Link, useParams } from '@tanstack/react-router'
import { useCurrentProfile, useProfilePicture } from '../hooks/useProfile'
import {
	useAcceptFriendRequest,
	useInviteFriends,
	useRemoveRelationship,
} from '../hooks/useFriends'
import { useActiveProfileId, useAuthUser } from '../hooks/useAuthUser'
import UserLogo from '../assets/icons/avatar.svg'
import { useState } from 'react'
import { DataImageTransferModal } from '../components/modal/DataImageTransferModal'
import { PostForm } from '../components/form/PostForm'
import { ProfilePosts } from '../components/posts/ProfilePosts'
import { Button } from '../components/ui/button'
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from '../components/ui/avatar'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '../components/ui/tooltip'

export const ProfileView = () => {
	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const activeProfileId = useActiveProfileId()

	const { profile, isLoading } = useCurrentProfile(profileId)
	const { sendInvite } = useInviteFriends()
	const { removeRelationship } = useRemoveRelationship()
	const { acceptRequest } = useAcceptFriendRequest()

	const { mutate: uploadProfilePicture } = useProfilePicture()

	const [isOpen, setIsOpen] = useState(false)

	const closeModal = () => {
		setIsOpen(false)
	}

	const openModal = () => {
		setIsOpen(true)
	}

	if (isLoading || !profile || !activeProfileId) return <div>Is Loading...</div>

	return (
		<>
			<div className="flex flex-wrap">
				<div className="w-full">
					<div className="w-full h-[30vh] min-h-60 bg-secondary rounded-b-md mb-5 relative flex items-end">
						<div className="flex flex-wrap justify-between w-full">
							<div className="flex flex-1 flex-wrap gap-5 h-fit pl-2.5 pb-2.5 items-center">
								<div className="size-30 group relative">
									{profile?.isOwner ? (
										<Tooltip>
											<TooltipTrigger onClick={openModal} className="size-full">
												<div className="overflow-hidden bg-red-200 rounded-full size-full shadow-lg">
													<img
														className="object-cover size-full"
														src={profile?.picture ?? UserLogo}
													></img>
												</div>
											</TooltipTrigger>
											<TooltipContent>Bearbeiten</TooltipContent>
										</Tooltip>
									) : (
										<div className="overflow-hidden bg-red-200 rounded-full size-full shadow-lg">
											<img
												className="object-cover size-full"
												src={profile?.picture ?? UserLogo}
											></img>
										</div>
									)}
								</div>
								<div className="text-2xl h-fit font-bold  text-foreground">
									{profile.name} {profile.id === activeProfileId && '(me)'}
								</div>
							</div>
							<div className="w-auto pr-5 pb-5 flex items-end">
								{!profile.isOwner &&
									profile?.friendship?.status === 'accepted' && (
										<Button onClick={() => removeRelationship(profileId)}>
											Remove friend
										</Button>
									)}

								{!profile.isOwner && profile?.friendship === null && (
									<Button onClick={() => sendInvite(profileId)}>
										Send invite
									</Button>
								)}

								{profile?.friendship?.status === 'pending' &&
									(profile?.friendship?.actionProfileId !== activeProfileId ? (
										<Button
											onClick={() =>
												acceptRequest(profile?.friendship?.actionProfileId)
											}
										>
											Accept friend request
										</Button>
									) : (
										<Button onClick={() => removeRelationship(profileId)}>
											Remove friend request
										</Button>
									))}
							</div>
						</div>
					</div>

					<div className="flex flex-wrap"></div>

					{profile?.friends && (
						<div className="mb-5">
							<Link
								className="mb-10"
								to="/profile/$profileId/friends"
								params={{ profileId }}
							>
								<h3 className="font-bold text-lg mb-2.5">{`${profile.name}´s friends`}</h3>
								<AvatarGroup>
									{profile.friends.map((friend) => (
										<Avatar>
											<AvatarImage src={friend?.picture || undefined} />
											<AvatarFallback>
												{friend.name?.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
									))}
									<AvatarGroupCount>+10</AvatarGroupCount>
								</AvatarGroup>
							</Link>
						</div>
					)}

					<PostForm className="mb-5" receiverId={profile?.id} />
					<ProfilePosts profileId={profileId} />
				</div>
			</div>
			<DataImageTransferModal
				onUpload={(files) => uploadProfilePicture(files[0])}
				multiple={false}
				open={isOpen}
				onOpenChange={closeModal}
			/>
		</>
	)
}
