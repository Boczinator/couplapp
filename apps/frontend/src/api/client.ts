import ky from 'ky'

const baseClient = ky.extend({
	baseUrl: import.meta.env.VITE_PUBLIC_BACKEND_URL,
	prefix: import.meta.env.VITE_PUBLIC_BACKEND_API_PREFIX,
	credentials: 'include',
})

export const client = baseClient.extend({
	hooks: {
		afterResponse: [
			async ({ request, response, retryCount }) => {
				try {
					if (
						response.status === 401 &&
						retryCount === 0 &&
						!request.url.includes('/auth/logout')
					) {
						await baseClient.post('/auth/refresh')

						return ky.retry({ request })
					}
				} catch (refreshError) {
					throw refreshError
				}

				return response
			},

			({ response, request, retryCount }) => {
				if (response.status === 429 && retryCount < 3) {
					return ky.retry({ request, delay: 1000 })
				}

				return response
			},
		],
	},
})
