import { useState } from 'react'

export const UploadMedia = () => {
	const [files, setFiles] = useState(null)

	return (
		<input
			type="file"
			name="avatar"
			className="bg-gray-200 rounded-sm w-100 h-100"
		></input>
	)
}
