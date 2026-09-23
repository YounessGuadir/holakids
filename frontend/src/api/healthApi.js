import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 6000,
  headers: {
    Accept: 'application/json',
  },
})

export async function getHealth(signal) {
  const response = await api.get('/health', { signal })
  return response.data
}

