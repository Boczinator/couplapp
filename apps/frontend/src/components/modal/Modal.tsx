import type React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'

export interface ModalProps extends DialogPrimitive.Root.Props {
	trigger?: React.ReactElement
	title?: React.ReactNode
	description?: React.ReactNode
	children?: React.ReactNode
	className?: string
}

export const Modal = ({
	children,
	trigger,
	title,
	description,
	className,
	...props
}: ModalProps) => {
	return (
		<Dialog {...props}>
			{trigger && <DialogTrigger render={trigger} />}

			<DialogContent className={className ?? 'sm:max-w-sm'}>
				{(title || description) && (
					<DialogHeader>
						{title && <DialogTitle>{title}</DialogTitle>}
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
				)}
				{children}
			</DialogContent>
		</Dialog>
	)
}
