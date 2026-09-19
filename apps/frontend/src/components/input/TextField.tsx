import { useField } from 'formik'
import { useState, type InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type TextFieldProps = {
	name: string
	label: string
	className?: string
} & InputHTMLAttributes<HTMLInputElement>

export const TextField = ({ label, className, ...props }: TextFieldProps) => {
	const [field, meta] = useField(props)
	const [isFocused, setIsFocused] = useState(false)

	const isFloating = isFocused || !!field.value

	return (
		<div className={twMerge('mb-6 relative w-full', className)}>
			<label
				htmlFor={props.id || field.name}
				className={twMerge(
					'absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 bg-white px-1 pointer-events-none transition-all duration-200 origin-left text-sm',
					isFloating && 'top-0 -translate-y-1/2 text-xs text-black scale-95',
				)}
			>
				{label}
			</label>

			<input
				{...field}
				{...props}
				className={twMerge(
					'text-sm text-black bg-white border border-black py-1.5 px-3 w-full rounded-sm outline-none focus:border-blue-500',
					meta.touched && meta.error && 'border-red-500',
				)}
				onFocus={(e) => {
					setIsFocused(true)
					props.onFocus?.(e)
				}}
				onBlur={(e) => {
					setIsFocused(false)
					field.onBlur(e)
					props.onBlur?.(e)
				}}
			/>

			{meta.touched && meta.error ? (
				<div className="text-red-500 absolute bottom-0 translate-y-full text-xs left-1 mt-0.5">
					{meta.error}
				</div>
			) : null}
		</div>
	)
}
