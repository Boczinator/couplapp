import { FormikProvider, useFormik } from 'formik'
import { useEditPost } from '../../hooks/usePosts'
import { TextAreaField } from '../input/TextAreaField'
import { Button } from '../button/Button'

type EditPostFormProps = {
	postId: string
	initialPostText: string
	currentProfileId: string
	onSuccess?: () => void
	onAbort?: () => void
}

export const EditPostForm = ({
	postId,
	initialPostText,
	currentProfileId,
	onSuccess,
	onAbort,
}: EditPostFormProps) => {
	const { mutate: updatePost } = useEditPost(currentProfileId)

	const formik = useFormik({
		initialValues: {
			text: initialPostText,
		},
		onSubmit: ({ text }) => {
			try {
				updatePost({
					id: postId,
					post: {
						text,
					},
				})

				if (onSuccess) {
					onSuccess()
				}
			} catch (error) {
				console.log(error)
			}
		},
	})

	return (
		<FormikProvider value={formik}>
			<form onSubmit={formik.handleSubmit}>
				<TextAreaField name="text" label="Text"></TextAreaField>
				<Button className="mb-5" type="submit">
					Update Post
				</Button>
				<Button type="button" variant="red" onClick={onAbort}>
					Dismiss
				</Button>
			</form>
		</FormikProvider>
	)
}
