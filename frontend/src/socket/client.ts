import { io } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL

const socket = io(backendUrl)
