import { useProfileOverview, useSwitchActiveProfile } from '../hooks/useProfile'
import logo from '../assets/icons/avatar.svg'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '../routes/_authenticated/_gateway/create-profile'

export const ProfileSelectionView = () => {
	const { profiles } = useProfileOverview()

	const { switchActiveProfile } = useSwitchActiveProfile()
	const navigate = useNavigate()

	return (
		<div className="flex justify-center flex-wrap flex-col">
			<div className="text-4xl font-bold text-center w-full mb-10">
				Choose your profile
			</div>
			{profiles?.map((profile) => (
				<div key={profile.id} className="w-full flex justify-center">
					<button
						className="cursor-pointer text-[#06202B] bg-gray-200 font-medium text-2xl hover:bg-[#7AE2CF] transition-colors px-5 py-3 flex gap-3 rounded-2xl items-center mb-5"
						onClick={() => switchActiveProfile(profile.id)}
					>
						<span className="rounded-full border-white border-2 overflow-hidden size-13 bg-white">
							<img src={profile.picture || logo} className="size-full" />
						</span>
						{profile.name}
					</button>
				</div>
			))}

			<div className="w-full flex justify-center mb-30">
				<button
					className="cursor-pointer text-[#06202B] font-medium text-xl transition-colors px-5 py-3 hover:bg-[#FF624C] hover:text-white rounded-2xl"
					onClick={() =>
						navigate({
							to: Route.fullPath,
						})
					}
				>
					+ Create additional Profile
				</button>
			</div>
		</div>
	)
}
