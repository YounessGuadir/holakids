import { apiClient } from './client'

export async function getHealth(signal) {
  const response = await apiClient.get('/health', { signal })
  return response.data
}
