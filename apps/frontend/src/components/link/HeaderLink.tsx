import { Link, type LinkProps } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

export const HeaderLink = ({
	children,
	className,
	...props
}: LinkProps & { className?: string }) => {
	return (
		<Link
			className={twMerge(
				'text-md bg-red w-full rounded-sm py-2 group',
				className,
			)}
			{...props}
		>
			{(linkState) => (
				<span className="flex justify-between w-full flex-wrap">
					{typeof children === 'function' ? children(linkState) : children}
				</span>
			)}
		</Link>
	)
}
