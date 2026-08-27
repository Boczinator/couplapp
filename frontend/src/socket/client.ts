import { io } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL

export const socket = io(backendUrl, {
	withCredentials: true,
})

socket.on('connect', () => {
	console.log(1234)
})
