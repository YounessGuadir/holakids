import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCatalog } from '../api/catalogApi'
import { readApiError } from '../api/client'
import { localizeCategory, localizeProduct } from '../utils/localize'
import { useLocale } from './LocaleContext'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const { locale } = useLocale()
  const [rawProducts, setRawProducts] = useState([])
  const [rawCategories, setRawCategories] = useState([])
  const [metadata, setMetadata] = useState({ brands: [], ageRanges: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchCatalog()
      setRawProducts(data.products)
      setRawCategories(data.categories)
      setMetadata(data.metadata)
    } catch (requestError) {
      setError(readApiError(requestError, 'API indisponible'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const value = useMemo(() => ({
    products: rawProducts.map((product) => localizeProduct(product, locale)),
    rawProducts,
    categories: rawCategories.map((category) => localizeCategory(category, locale)),
    rawCategories,
    brands: metadata.brands || [],
    loading,
    error,
    refresh,
  }), [error, loading, locale, metadata.brands, rawCategories, rawProducts, refresh])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog doit être utilisé dans CatalogProvider')
  return context
}
