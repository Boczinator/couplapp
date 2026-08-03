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

				formik.resetForm()
			} catch (error) {
				console.log(error)
			}
		},
	})

	return (
		<div className={className}>
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<div className="w-1/2 mb-2.5">
						<TextAreaField name="text" label="Schreibe etwas..." />
					</div>
					<div className="w-1/2">
						<Button type="submit">Posten</Button>
					</div>
				</form>
			</FormikProvider>
		</div>
	)
}
