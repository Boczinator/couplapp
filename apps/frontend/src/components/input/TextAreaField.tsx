import { useField } from 'formik'
import { useState, type InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type TextAreaProps = {
	label: string
	className?: string
} & InputHTMLAttributes<HTMLTextAreaElement>

export const TextAreaField = ({
	label,
	className,
	//placeholder,
	...props
}: TextAreaProps) => {
	const [field, meta] = useField(props)
	const [isFocused, setIsFocused] = useState(meta.touched)

	const handleFocus = () => {
		setIsFocused(!!field.value)
	}

	return (
		<div className={twMerge('relative w-full', className)}>
			<label
				className={twMerge(
					'mr-2 top-1/2 left-0 absolute -translate-y-1/2 px-1 transform transition-transform scale-100 hidden',
					isFocused ? 'scale-50' : '',
				)}
				htmlFor={field.name}
			>
				{label}
			</label>
			<textarea
				className="text-sm text-black bg-white border-black py-1.5 px-1 border w-full rounded-sm"
				onFocus={handleFocus}
				{...field}
				{...props}
			/>
			{meta.touched && meta.error ? (
				<div className="text-red-500 absolute bottom-0 translate-y-full text-xs">
					{meta.error}
				</div>
			) : null}
		</div>
	)
}
