import { FormikProvider, useFormik } from 'formik'
import { Modal } from './Modal'
import { client } from '../../api/client'
import { Button } from '../button/Button'

export const DataImageTransferModal = ({ isOpen, onClose }) => {
	const formik = useFormik({
		initialValues: {
			avatar: null,
		},
		onSubmit: async ({ avatar }) => {
			try {
				const formData = new FormData()
				formData.append('file', avatar)

				await client.patch('profiles/avatar', {
					body: formData,
				})

				onClose()
			} catch (error) {
				console.log(error)
			}
		},
	})

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<FormikProvider value={formik}>
				<form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
					<input
						type="file"
						name="avatar"
						className="bg-gray-200 rounded-sm w-100 h-60"
						onChange={(e) =>
							formik.setFieldValue('avatar', e.currentTarget.files[0])
						}
					></input>
					<Button type="submit">Upload</Button>
				</form>
			</FormikProvider>
		</Modal>
	)
}
