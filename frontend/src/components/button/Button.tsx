import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
	isLoading?: boolean
	icon: ReactNode
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading: false,
    icon,
    className:
}: ButtonProps) => {}
