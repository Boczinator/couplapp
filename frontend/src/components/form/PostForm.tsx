import { FormikProvider, useFormik } from 'formik'
import { useCreatePost } from '../../hooks/usePosts'
import { Button } from '../button/Button'
import { TextAreaField } from '../input/TextAreaField'

export const PostForm = () => {
	const { mutate: createPost } = useCreatePost()

	const formik = useFormik({
		initialValues: {
			text: '',
		},
		onSubmit: async ({ text }) => {
			try {
				createPost({ text })
			} catch (error) {
				console.log(error)
			}
		},
	})

	return (
		<FormikProvider value={formik}>
			<form onSubmit={formik.handleSubmit}>
				<TextAreaField name="text" label="Schreibe etwas..." />
				<Button type="submit">Posten</Button>
			</form>
		</FormikProvider>
	)
}
