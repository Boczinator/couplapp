export const Post = ({ text, userName, userPicture }) => {
	return (
		<div>
			<div>{text}</div>
			<div>{userName}</div>
			<div>{userPicture}</div>
		</div>
	)
}
