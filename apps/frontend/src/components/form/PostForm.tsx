import { FormikProvider, useFormik } from 'formik'
import { useCreatePost } from '../../hooks/usePosts'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

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
						<Textarea
							name="text"
							placeholder="Schreibe etwas..."
							onChange={(e) => formik.setFieldValue('text', e.target.value)}
						/>
					</div>
					<div className="w-1/2">
						<Button className="w-full" type="submit">
							Posten
						</Button>
					</div>
				</form>
			</FormikProvider>
		</div>
	)
}
