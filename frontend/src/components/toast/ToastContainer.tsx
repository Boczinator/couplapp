import { ToastTypes, useToast } from './ToastContext'
import { clsx } from 'clsx/lite'

export const ToastContainer = () => {
	const { toastItems, removeToast } = useToast()

	return (
		<div className="fixed right-5 bottom-5">
			{toastItems.map((toast) => (
				<div
					key={toast.id}
					className={clsx(
						'text-sm font-bold px-5 py-4',
						toast.type === ToastTypes.Error && 'bg-red-200 text-red-500',
						toast.type === ToastTypes.Success && 'bg-green-200 text-green-500',
						toast.type === ToastTypes.Info && 'bg-yellow-200 text-yellow-500',
					)}
				>
					<p>{toast.message}</p>
					<button
						className={clsx(
							toast.type === ToastTypes.Error && 'bg-red-200 text-red-500',
							toast.type === ToastTypes.Success &&
								'bg-green-200 text-green-500',
							toast.type === ToastTypes.Info && 'bg-yellow-200 text-yellow-500',
						)}
						onClick={() => removeToast(toast.id)}
					>
						X
					</button>
				</div>
			))}
		</div>
	)
}
