import UserLogo from '../../assets/icons/avatar.svg'

type ProfileCardProps = {
	name: string
	image?: string
}

export const ProfileCard = ({ image, name }: ProfileCardProps) => {
	return (
		<div className="flex items-center gap-2">
			<img src={image || UserLogo} className="size-10"></img>
			{name}
		</div>
	)
}
