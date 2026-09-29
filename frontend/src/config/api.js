const localServerUrl = 'http://localhost:5000'
const deployedServerUrl = 'https://sadik-la5u.onrender.com'

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.PROD ? deployedServerUrl : localServerUrl)
export const API_URL = import.meta.env.VITE_API_URL || `${SERVER_URL}/api`
