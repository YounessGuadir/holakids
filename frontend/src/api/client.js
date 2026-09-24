import axios from 'axios'

const configuredApiUrl = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '')

export const apiClient = axios.create({
  baseURL: configuredApiUrl,
  // Une instance Cloud Run à zéro peut avoir besoin de quelques secondes pour redémarrer.
  timeout: 90000,
})

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('holakids_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function readApiError(error, fallback = 'Une erreur est survenue.') {
  return error?.response?.data?.message || error?.message || fallback
}
