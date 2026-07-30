import { Link, useParams } from '@tanstack/react-router'
import { useCurrentProfile } from '../hooks/useProfile'
import { Button } from '../components/button/Button'
import {
	useAcceptFriendRequest,
	useInviteFriends,
	useRemoveRelationship,
} from '../hooks/useFriends'
import { useAuthUser } from '../hooks/useAuthUser'
import UserLogo from '../assets/icons/avatar.svg'
import { useState } from 'react'
import { DataImageTransferModal } from '../components/modal/DataImageTransferModal'
import { ProfileCard } from '../components/card/ProfileCard'
import { PostForm } from '../components/form/PostForm'
import { ProfilePosts } from '../components/posts/ProfilePosts'

export const ProfileView = () => {
	const { profileId } = useParams({
		from: '/_authenticated/profile/$profileId',
	})

	const {
		user: { activeProfileId },
	} = useAuthUser()

	const { profile, isLoading } = useCurrentProfile(profileId)
	const { sendInvite } = useInviteFriends()
	const { removeRelationship } = useRemoveRelationship()
	const { acceptRequest } = useAcceptFriendRequest()

	const [isOpen, setIsOpen] = useState(false)

	const closeModal = () => {
		setIsOpen(false)
	}

	const openModal = () => {
		setIsOpen(true)
	}

	if (isLoading) return <div>Is Loading...</div>

	return (
		<>
			<div className="flex flex-wrap">
				<div className="w-3/4">
					<div className="w-full h-[30vh] min-h-60 bg-gray-300 rounded-b-md mb-5 relative flex items-end">
						<div className="flex flex-wrap justify-between w-full">
							<div className="flex flex-1 flex-wrap gap-5 h-fit pl-2.5 pb-2.5 items-center">
								<div className="size-30 group relative">
									<div className="overflow-hidden bg-red-200 rounded-full size-full shadow-lg">
										<img
											className="object-cover size-full"
											src={profile?.picture ?? UserLogo}
										></img>
									</div>
									{profile?.isOwner && (
										<button
											onClick={openModal}
											className="absolute bottom-2 left-1/2 translate-y-full -translate-x-1/2 z-0 hidden group-hover:block p-2 bg-white text-sm border-2 border-[#FF6D56] shadow-xl cursor-pointer before:absolute before:top-0 before:left-1/2 before:-translate-y-1/2 before:-translate-x-1/2 before:-z-10 before:size-4 before:rotate-45 before:bg-white before:border-2 before:border-[#FF6D56]"
										>
											Bearbeiten
										</button>
									)}
								</div>
								<div className="text-2xl h-fit font-bold  text-[#ff6d56]">
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

					<PostForm className="mb-5" />
					<ProfilePosts profileId={profileId} />
				</div>
				<div className="w-1/4 px-2.5 gap-3 flex-col flex">
					<h3 className="font-bold text-lg">{`${profile.name}´s friends`}</h3>
					{profile?.friends &&
						profile.friends.map((friend) => (
							<Link
								to="/profile/$profileId"
								params={{ profileId: friend.id }}
								className="cursor-pointer"
							>
								<ProfileCard image={friend.picture} name={friend.name} />
							</Link>
						))}
				</div>
			</div>
			<DataImageTransferModal isOpen={isOpen} onClose={closeModal} />
		</>
	)
}
