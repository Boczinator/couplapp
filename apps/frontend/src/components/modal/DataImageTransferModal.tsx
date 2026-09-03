import { FormikProvider, useFormik } from 'formik'
import { Modal } from './Modal'
import { useProfilePicture } from '../../hooks/useProfile'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'

interface DataImageTransferModalProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	trigger?: React.ReactElement
}

export const DataImageTransferModal = ({
	open,
	onOpenChange,
	trigger,
}: DataImageTransferModalProps) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const { mutate } = useProfilePicture()

	const formik = useFormik({
		initialValues: {
			avatar: null as File | null,
		},
		onSubmit: async ({ avatar }) => {
			if (!avatar) return
			try {
				mutate(avatar)
				onOpenChange?.(false)
			} catch (error) {
				console.error(error)
			}
		},
	})

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl)
		}
	}, [previewUrl])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.currentTarget.files?.[0] ?? null

		if (selectedFile) {
			formik.setFieldValue('avatar', selectedFile)
			setPreviewUrl(URL.createObjectURL(selectedFile))
		} else {
			formik.setFieldValue('avatar', null)
			setPreviewUrl(null)
		}
	}

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			trigger={trigger}
			title="Upload Profile Picture"
			description="Choose a new photo to update your profile image."
		>
			<FormikProvider value={formik}>
				<form
					encType="multipart/form-data"
					onSubmit={formik.handleSubmit}
					className="space-y-4"
				>
					{previewUrl && (
						<div className="flex justify-center">
							<img
								className="size-48 object-cover rounded-full border border-border"
								src={previewUrl}
								alt="Profile preview"
							/>
						</div>
					)}

					<input
						type="file"
						name="avatar"
						accept="image/*"
						className="bg-secondary text-secondary-foreground rounded-sm w-full p-2 text-sm"
						onChange={handleFileChange}
					/>

					<div className="flex justify-end gap-2 pt-2">
						<Button
							className="w-full"
							type="submit"
							disabled={!formik.values.avatar || formik.isSubmitting}
						>
							Upload
						</Button>
					</div>
				</form>
			</FormikProvider>
		</Modal>
	)
}
