import { useNavigate } from '@tanstack/react-router'
import { useProfileOverview } from '../hooks/useProfile.hook'

export const ProfileSelectionView = () => {
	const { profiles } = useProfileOverview()

	const navigate = useNavigate()

	return (
		<>
			<div className="text-2xl font-bold">Profiles</div>
			{profiles?.map((profile) => (
				<button
					className="cursor-pointer"
					onClick={() =>
						navigate({
							to: '/profiles/$profileId',
							params: { profileId: profile.id },
						})
					}
					key={profile.id}
				>
					{profile.name}
				</button>
			))}
		</>
	)
}
