import { FormikProvider, useFormik } from 'formik'
import { TextField } from '../input/TextField'
import { useCreateProfile } from '../../hooks/useProfile'
import { Button } from '../button/Button'

export const CreateProfileForm = () => {
	const { createProfile, isPending } = useCreateProfile()

	const formik = useFormik({
		initialValues: {
			name: '',
			bio: '',
			picture: '',
			bannerPicture: '',
			isPrivate: '',
		},
		onSubmit: ({ name, bio, isPrivate: isPrivate, bannerPicture, picture }) => {
			createProfile({
				name,
				bio,
				isPrivate: isPrivate === 'true',
				bannerPicture,
				picture,
			})
		},
	})

	if (isPending) return <div>Submitting new profile...</div>

	return (
		<FormikProvider value={formik}>
			<form onSubmit={formik.handleSubmit}>
				<TextField
					name="name"
					placeholder="Profilname"
					id="name"
					type="text"
					label="Profilname"
				/>
				<TextField
					name="bio"
					placeholder="About me"
					id="bio"
					type="text"
					label="About me"
				/>
				<div className="mb-5">
					<label>
						<input name="isPrivate" type="radio" value="true" />
						Yes
					</label>
					<label>
						<input name="isPrivate" type="radio" value="false" />
						No
					</label>
				</div>

				<Button type="submit">Create new profile</Button>
			</form>
		</FormikProvider>
	)
}
