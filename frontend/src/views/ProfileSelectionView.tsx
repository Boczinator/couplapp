import { useNavigate } from '@tanstack/react-router'
import { useProfileOverview } from '../hooks/useProfile.hook'
import logo from '../assets/icons/avatar.svg'

export const ProfileSelectionView = () => {
	const { profiles } = useProfileOverview()

	const navigate = useNavigate()

	return (
		<div className="flex justify-center flex-wrap">
			<div className="text-4xl font-bold text-center w-full mb-10">
				Choose your profile
			</div>
			{profiles?.map((profile) => (
				<button
					className="cursor-pointer text-[#06202B] bg-gray-200 font-medium text-3xl hover:bg-[#7AE2CF] transition-colors px-5 py-3 flex gap-3 rounded-2xl items-center "
					onClick={() =>
						navigate({
							to: '/profile/$profileId',
							params: { profileId: profile.id },
						})
					}
					key={profile.id}
				>
					<span className="rounded-full border-white border-2 p-1 size-10 bg-white">
						<img src={profile.picture || logo} className="size-full" />
					</span>
					{profile.name}
				</button>
			))}
		</div>
	)
}
