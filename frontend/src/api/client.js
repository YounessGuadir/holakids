import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('holakids_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function readApiError(error, fallback = 'Une erreur est survenue.') {
  return error?.response?.data?.message || error?.message || fallback
}
