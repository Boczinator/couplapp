import ky from 'ky'

const baseClient = ky.extend({
	baseUrl: 'http://localhost:3000',
	credentials: 'include',
})

export const client = baseClient.extend({
	hooks: {
		afterResponse: [
			async ({ response }) => {
				if (response.status === 401) {
					await baseClient.post('/auth/refresh')
				}
			},
		],
	},
})
