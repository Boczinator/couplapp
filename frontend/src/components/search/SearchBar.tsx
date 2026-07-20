import { useNavigate } from '@tanstack/react-router'
import { FormikProvider, useFormik } from 'formik'
import { useDebounce } from '../../hooks/useDebounce.hook'
import { useSearchProfiles } from '../../hooks/useSearchProfiles.hook'
import { TextField } from '../input/TextField'

export const SearchBar = () => {
	const navigate = useNavigate()

	const formik = useFormik({
		initialValues: {
			searchTerm: '',
		},
		onSubmit: (values) => {
			values.searchTerm = ''
		},
	})

	const { debouncedTerm } = useDebounce(formik.values.searchTerm)

	const { data: profiles, isLoading } = useSearchProfiles(debouncedTerm)

	return (
		<div className="w-full relative">
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<TextField
						className="w-full mb-0"
						type="text"
						name="searchTerm"
						id="searchTerm"
						placeholder="Search Term"
						label="Search Term"
					/>
				</form>
			</FormikProvider>
			{isLoading && <div>Searching...</div>}

			{profiles && profiles.length > 0 && (
				<div className="absolute bottom-0 bg-red-50 w-full transform translate-y-full px-5 py-5 rounded-b-2xl shadow-2xl">
					{profiles.map((profile) => (
						<button
							key={profile.id}
							className="first:pt-0 last:border-0 last:pb-0 py-2.5 w-full text-left border-b border-gray cursor-pointer"
							type="button"
							onClick={() => {
								formik.setFieldValue('searchTerm', '')
								navigate({
									to: '/profile/$profileId',
									params: { profileId: String(profile.id) },
								})
							}}
						>
							{profile.name}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
