import { FormikProvider, useFormik } from 'formik'
import { useCreatePost } from '../../hooks/usePosts'
import { Button } from '../button/Button'
import { TextAreaField } from '../input/TextAreaField'

type PostForm = { receiverId: string } & React.ComponentPropsWithoutRef<'div'>

export const PostForm = ({ receiverId, className }: PostForm) => {
	const { mutate: createPost } = useCreatePost()

	const formik = useFormik({
		initialValues: {
			text: '',
		},
		onSubmit: async ({ text }) => {
			try {
				createPost({ post: { text }, receiverId })

				formik.setFieldValue('text', '')
			} catch (error) {
				console.log(error)
			}
		},
	})

	return (
		<div className={className}>
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<TextAreaField name="text" label="Schreibe etwas..." />
					<Button type="submit">Posten</Button>
				</form>
			</FormikProvider>
		</div>
	)
}
