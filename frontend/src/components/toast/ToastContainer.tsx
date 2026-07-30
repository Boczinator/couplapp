import { ToastTypes, useToast } from './ToastContext'
import { clsx } from 'clsx/lite'

export const ToastContainer = () => {
	const { toastItems, removeToast } = useToast()

	return (
		<div className="fixed px-5 w-full sm:w-auto sm:px-0 sm:right-5 bottom-5 flex flex-col gap-2 max-h-full overflow-y-auto">
			{toastItems.map((toast) => (
				<div
					key={toast.id}
					className={clsx(
						'text-sm font-bold px-5 py-4 rounded-xl w-full sm:w-100 relative border-2 bg-white shadow-2xl',
						toast.type === ToastTypes.Error &&
							'border-red-500 text-red-500 hover:bg-red-100',
						toast.type === ToastTypes.Success &&
							'border border-green-500 text-green-500 hover:bg-green-100',
						toast.type === ToastTypes.Info &&
							'border-yellow-500 text-yellow-500',
					)}
				>
					<p>{toast.message}</p>
					<button
						className={clsx(
							'absolute right-4 top-4 cursor-pointer',
							toast.type === ToastTypes.Error && ' text-red-500',
							toast.type === ToastTypes.Success && ' text-green-500',
							toast.type === ToastTypes.Info && ' text-yellow-500',
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
