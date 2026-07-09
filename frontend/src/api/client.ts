import ky from 'ky'

const baseClient = ky.extend({
	baseUrl: 'http://localhost:3000',
	credentials: 'include',
})

export const client = baseClient.extend({
	hooks: {
		afterResponse: [
			async ({ response, retryCount }) => {
				if (response.status === 401 && retryCount === 0) {
					await baseClient.post('/auth/refresh')

					baseClient.retry()
				}

				if (response.status === 429 && retryCount < 3) {
					baseClient.retry({
						delay: 1000,
					})
				}
			},
		],
	},
})
