import { apiClient } from './client'

export async function fetchCatalog() {
  const [productsResponse, categoriesResponse, metadataResponse] = await Promise.all([
    apiClient.get('/products', { params: { page: 0, size: 48, sort: 'featured' } }),
    apiClient.get('/categories'),
    apiClient.get('/products/meta'),
  ])
  return {
    products: productsResponse.data.content,
    categories: categoriesResponse.data,
    metadata: metadataResponse.data,
  }
}

export async function fetchProducts(params = {}) {
  const response = await apiClient.get('/products', { params })
  return response.data
}

export async function fetchProduct(slug) {
  const response = await apiClient.get(`/products/${slug}`)
  return response.data
}

export async function fetchRelatedProducts(slug, limit = 4) {
  const response = await apiClient.get(`/products/${slug}/related`, { params: { limit } })
  return response.data
}
