import { useField } from 'formik'
import type { HTMLInputTypeAttribute } from 'react'
import { twMerge } from 'tailwind-merge'

type TextField = {
	label: string
	name: string
	id: string
	placeholder?: string
	type: HTMLInputTypeAttribute
	className?: string
}

export const TextField = ({ label, className, ...props }: TextField) => {
	const [field, meta] = useField(props)

	return (
		<>
			<label className="mr-2" htmlFor={field.name}>
				{label}
			</label>
			<input
				className={twMerge(
					'text-sm text-black border-2 border-black',
					className,
				)}
				{...field}
				{...props}
			/>
			{meta.touched && meta.error ? (
				<div className="text-red-500">{meta.error}</div>
			) : null}
		</>
	)
}
