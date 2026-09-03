import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react'

export const ToastTypes = {
	Success: 'success',
	Error: 'error',
	Info: 'info',
} as const

export type ToastTypes = (typeof ToastTypes)[keyof typeof ToastTypes]

export type Toast = {
	id: string
	message: string
	type: ToastTypes
	duration?: number
}

type AddToast = Pick<Toast, 'message' | 'type'>

export type ToastContextProps = {
	toastItems: Toast[]
	addToast: (toast: AddToast) => void
	removeToast: (id: string) => void
}

type ToastProviderProps = {
	children: ReactNode
}

export const ToastContext = createContext<ToastContextProps | undefined>(
	undefined,
)

export const useToast = (): ToastContextProps => {
	const context = useContext(ToastContext)

	if (!context) {
		throw new Error('useToast must be used inside a ToastProvider')
	}

	return context
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [toastItems, setToastItems] = useState<Toast[]>([])

	const addToast = (toast: AddToast) => {
		const toastWithId = {
			...toast,
			id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
		}

		setToastItems((prevToastItems) => [...prevToastItems, toastWithId])
	}

	const removeToast = (id: string) => {
		setToastItems((prevToastItems) =>
			prevToastItems.filter((toast) => toast.id !== id),
		)
	}

	useEffect(() => {
		toastItems.forEach((toast) => {
			const timeoutId = setTimeout(() => {
				removeToast(toast.id)
			}, toast.duration || 6000)

			return () => clearTimeout(timeoutId)
		})
	}, [toastItems])

	return (
		<ToastContext.Provider
			value={{
				toastItems,
				addToast,
				removeToast,
			}}
		>
			{children}
		</ToastContext.Provider>
	)
}
