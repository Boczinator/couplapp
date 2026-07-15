import clsx from 'clsx/lite'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
	icon?: ReactNode
}

export const Button = ({
	children,
	variant = 'primary',
	icon,
	className,
	...props
}: ButtonProps) => {
	return (
		<button
			className={twMerge(
				clsx(
					'px-1.5 py-2 w-full text-bold cursor-pointer flex gap-1 justify-center disabled:bg-gray-400 transition-colors rounded-sm',
					variant === 'primary' &&
						'bg-[#7AE2CF] text-[#06202B] hover:bg-[#06202B] hover:text-[#7AE2CF]',
					className,
				),
			)}
			{...props}
		>
			{children}
			{icon && <span className=""></span>}
		</button>
	)
}
