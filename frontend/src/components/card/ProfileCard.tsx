import { Link, type LinkProps } from '@tanstack/react-router'
import UserLogo from '../../assets/icons/avatar.svg'
import type { HTMLAttributes } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'

type ProfileCardProps = {
	name: string
	image?: string
	children?: React.ReactNode
} & LinkProps &
	HTMLAttributes<HTMLDivElement>

export const ProfileCard = ({
	image,
	name,
	children,
	...props
}: ProfileCardProps) => {
	return (
		<Link {...props}>
			<span className="flex items-center gap-2">
				<Avatar size="lg">
					<AvatarImage src={image || UserLogo}></AvatarImage>
				</Avatar>
				{name}
			</span>
			{children}
		</Link>
	)
}
