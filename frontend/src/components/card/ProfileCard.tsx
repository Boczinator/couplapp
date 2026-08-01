import { Link, type LinkProps } from '@tanstack/react-router'
import UserLogo from '../../assets/icons/avatar.svg'

type ProfileCardProps = {
	name: string
	image?: string
} & LinkProps

export const ProfileCard = ({ image, name, ...props }: ProfileCardProps) => {
	return (
		<Link {...props} className="flex items-center gap-2">
			<img src={image || UserLogo} className="size-10"></img>
			{name}
		</Link>
	)
}
