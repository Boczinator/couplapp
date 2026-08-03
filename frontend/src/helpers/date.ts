export const formatDate = (date: Date) => {
	return {
		date: date.toLocaleDateString('en-GB'),
		time: date.toLocaleTimeString('en-GB'),
	}
}
