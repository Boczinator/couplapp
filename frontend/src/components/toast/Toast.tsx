import { useEffect, useState } from 'react'

type ToastProps = {
	message: string
	visible: boolean
	displayTime: number
	onClose: () => void
}

export const Toast = ({
	message,
	visible,
	displayTime = 3000,
	onClose,
}: ToastProps) => {
	useEffect(() => {
		if (!visible) {
			return
		}

		const toastTimer = setTimeout(async () => {
			onClose()
		}, displayTime)

		return () => clearTimeout(toastTimer)
	}, [visible])

	if (!visible) {
		return null
	}

	return <div>{message}</div>
}
