import { apiClient } from './client'

export async function fetchAdminProducts() {
  const products = []
  let page = 0
  let totalPages = 1
  while (page < totalPages) {
    const response = await apiClient.get('/admin/products', { params: { page, size: 100, sort: 'name' } })
    products.push(...response.data.content)
    totalPages = response.data.totalPages
    page += 1
  }
  return products
}

export async function createProduct(payload) {
  const response = await apiClient.post('/admin/products', payload)
  return response.data
}

export async function updateProduct(id, payload) {
  const response = await apiClient.put(`/admin/products/${id}`, payload)
  return response.data
}

export async function updateProductStock(id, stock) {
  const response = await apiClient.patch(`/admin/products/${id}/stock`, { stock })
  return response.data
}

export async function updateProductPrice(id, price, oldPrice, promotion) {
  const response = await apiClient.patch(`/admin/products/${id}/price`, { price, oldPrice, promotion })
  return response.data
}

export async function updateProductAvailability(id, active) {
  const response = await apiClient.patch(`/admin/products/${id}/availability`, { active })
  return response.data
}

export async function deleteProduct(id) {
  await apiClient.delete(`/admin/products/${id}`)
}

export async function uploadProductImage(file) {
  const body = new FormData()
  body.append('file', file)
  const response = await apiClient.post('/admin/files', body)
  return response.data.url
}

export async function fetchAdminCategories() {
  const response = await apiClient.get('/admin/categories')
  return response.data
}

export async function createCategory(payload) {
  const response = await apiClient.post('/admin/categories', payload)
  return response.data
}

export async function updateCategory(id, payload) {
  const response = await apiClient.put(`/admin/categories/${id}`, payload)
  return response.data
}

export async function deleteCategory(id) {
  await apiClient.delete(`/admin/categories/${id}`)
}
