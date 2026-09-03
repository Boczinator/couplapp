import { useNavigate } from '@tanstack/react-router'
import { FormikProvider, useFormik } from 'formik'
import { useDebounce } from '../../hooks/useDebounce'
import { useSearchProfiles } from '../../hooks/useSearchProfiles'
import { TextField } from '../input/TextField'
import { ProfileCard } from '../card/ProfileCard'
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from '../ui/combobox'
import { Avatar, AvatarImage } from '../ui/avatar'

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
		<Combobox items={profiles}>
			<ComboboxInput
				placeholder="Search..."
				value={formik.values.searchTerm}
				onChange={(e) => formik.setFieldValue('searchTerm', e.target.value)}
				showTrigger={false}
			/>
			<ComboboxEmpty>No items found.</ComboboxEmpty>
			<ComboboxContent>
				<ComboboxEmpty>No items found.</ComboboxEmpty>
				<ComboboxList>
					{(profile) => (
						<ComboboxItem
							key={profile.id}
							value={profile.id}
							onClick={() =>
								navigate({
									to: '/profile/$profileId',
									params: { profileId: String(profile.id) },
								})
							}
						>
							<Avatar>
								<AvatarImage src={profile.picture} />
							</Avatar>
							{profile.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}
