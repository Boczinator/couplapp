import { FormikProvider, useFormik } from 'formik'
import { useEditPost } from '../../hooks/usePosts'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

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
				<Textarea
					className="mb-5"
					name="text"
					placeholder="Type your post..."
					value={formik.values.text}
					onChange={formik.handleChange}
				></Textarea>
				<Button className="mb-2.5 w-full" type="submit">
					Update Post
				</Button>
				<Button
					className="w-full"
					type="button"
					variant="destructive"
					onClick={onAbort}
				>
					Dismiss
				</Button>
			</form>
		</FormikProvider>
	)
}
