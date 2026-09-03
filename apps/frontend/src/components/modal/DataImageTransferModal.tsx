import { FormikProvider, useFormik } from 'formik'
import { Modal } from './Modal'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'

interface DataImageTransferModalProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	trigger?: React.ReactElement
	onUpload?: (files: File[]) => void | Promise<void>
	multiple: boolean
}

export const DataImageTransferModal = ({
	open,
	onOpenChange,
	trigger,
	multiple = false,
	onUpload,
}: DataImageTransferModalProps) => {
	const [previewUrls, setPreviewUrls] = useState<string[]>([])

	const formik = useFormik({
		initialValues: {
			avatars: [] as File[],
		},
		onSubmit: async ({ avatars }) => {
			if (avatars.length === 0) return
			try {
				await onUpload?.(avatars)

				setPreviewUrls([])
				formik.setFieldValue('avatars', [])
				onOpenChange?.(false)
			} catch (error) {
				console.error(error)
			}
		},
	})

	useEffect(() => {
		return () => {
			previewUrls.forEach((url) => URL.revokeObjectURL(url))
		}
	}, [previewUrls])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.currentTarget.files ?? [])

		if (selectedFiles.length > 0) {
			const updatedFiles = [...formik.values.avatars, ...selectedFiles]
			formik.setFieldValue('avatars', updatedFiles)

			const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
			setPreviewUrls((prev) => [...prev, ...newPreviews])
		}
	}

	const handleRemoveImage = (index: number) => {
		URL.revokeObjectURL(previewUrls[index])

		const updatedFiles = formik.values.avatars.filter((_, i) => i !== index)
		const updatedPreviews = previewUrls.filter((_, i) => i !== index)

		formik.setFieldValue('avatars', updatedFiles)
		setPreviewUrls(updatedPreviews)
	}

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			trigger={trigger}
			title="Upload Images"
			description="Choose one or more photos to upload."
			className="sm:max-w-md"
		>
			<FormikProvider value={formik}>
				<form
					encType="multipart/form-data"
					onSubmit={formik.handleSubmit}
					className="space-y-4"
				>
					{previewUrls.length > 0 && (
						<div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
							{previewUrls.map((url, index) => (
								<div key={url} className="relative group aspect-square">
									<img
										className="size-full object-cover rounded-md border border-border"
										src={url}
										alt={`Preview ${index + 1}`}
									/>
									<button
										type="button"
										onClick={() => handleRemoveImage(index)}
										className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white text-xs rounded-full size-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
									>
										✕
									</button>
								</div>
							))}
						</div>
					)}

					<input
						type="file"
						name="avatar"
						accept="image/*"
						multiple={multiple}
						className="bg-secondary text-secondary-foreground rounded-sm w-full p-2 text-sm cursor-pointer"
						onChange={handleFileChange}
					/>

					<div className="flex justify-end gap-2 pt-2">
						<Button
							className="w-full"
							type="submit"
							disabled={
								formik.values.avatars.length === 0 || formik.isSubmitting
							}
						>
							Upload{' '}
							{formik.values.avatars.length > 0 &&
								`(${formik.values.avatars.length})`}
						</Button>
					</div>
				</form>
			</FormikProvider>
		</Modal>
	)
}
