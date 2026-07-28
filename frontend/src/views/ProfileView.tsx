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
import { Modal } from '../components/modal/Modal'
import { useState } from 'react'
import { DataImageTransferModal } from '../components/modal/DataImageTransferModal'

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
					<div className="w-full h-[30vh] min-h-60 bg-gray-300 rounded-b-md mb-5 relative">
						<div className="size-20 bg-red-200 rounded-full absolute left-2.5 bottom-2.5 p-3 group">
							<div>
								<img
									className="object-contain size-full"
									src={profile?.picture ?? UserLogo}
								></img>
								<button
									onClick={openModal}
									className="before:z-[-1] z-10 before:border-2 before:border-[#FF6D56] border-2 border-[#FF6D56] hidden group-hover:block text-sm bg-white shadow-xl cursor-pointer absolute before:size-4 before:rotate-45 before:left-1/2 before:-translate-x-1/2 p-2 before:top-0 before:-translate-1/2 before:absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full before:bg-white"
								>
									Bearbeiten
								</button>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap">
						<div className="w-3/4">
							<div>Name: {profile.name}</div>
							<div>Profile Id: {profile.id}</div>
							<div>User Id: {profile.userId}</div>
							<div>Is owner: {String(profile.isOwner)}</div>
							<div>Friendship status: {profile?.friendship?.status}</div>
						</div>
						<div className="w-1/4">
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
				<div className="w-1/4 px-2.5 gap-2 flex-col flex">
					<h3 className="font-bold text-lg">{`${profile.name}´s friends`}</h3>
					{profile?.friends &&
						profile.friends.map((friend) => (
							<div>
								<Link
									to="/profile/$profileId"
									params={{ profileId: friend.id }}
									className="cursor-pointer"
								>
									{friend.name}
								</Link>
							</div>
						))}
				</div>
			</div>
			<DataImageTransferModal isOpen={isOpen} onClose={closeModal} />
		</>
	)
}
