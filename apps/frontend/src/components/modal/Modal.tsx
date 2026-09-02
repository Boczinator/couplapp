import type React from 'react'

export type ModalProps = {
	isOpen: boolean
	children: React.ReactNode
	onClose: () => void
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	return (
		isOpen && (
			<div
				className="bg-white/50 backdrop-blur-none fixed size-full z-90 left-0 top-0"
				onClick={() => onClose}
			>
				<div
					className="absolute left-1/2 -translate-1/2 top-1/2 bg-white max-w-300 px-7.5 py-5"
					onClick={(e) => e.stopPropagation()}
				>
					<div onClick={onClose}>Close</div>
					{children}
				</div>
			</div>
		)
	)
}
