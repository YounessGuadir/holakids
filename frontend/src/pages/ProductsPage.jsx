import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../api/catalogApi'
import { readApiError } from '../api/client'
import ProductCard from '../components/ProductCard'
import { useCatalog } from '../context/CatalogContext'
import { useLocale } from '../context/LocaleContext'
import { localizeProduct, localizedAgeRanges } from '../utils/localize'

const PAGE_SIZE = 24

function ProductsPage() {
  const { categories, brands } = useCatalog()
  const { locale, t } = useLocale()
  const ageRanges = localizedAgeRanges(locale)
  const [searchParams, setSearchParams] = useSearchParams()
  const [age, setAge] = useState(searchParams.get('age') || 'all')
  const [brand, setBrand] = useState(searchParams.get('brand') || 'all')
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('available') === 'true')
  const [promotionOnly, setPromotionOnly] = useState(searchParams.get('promotion') === 'true')
  const [newOnly, setNewOnly] = useState(searchParams.get('new') === 'true')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(0)
  const [retryKey, setRetryKey] = useState(0)
  const [result, setResult] = useState({ content: [], totalElements: 0, totalPages: 0, number: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const category = searchParams.get('category') || 'all'
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setAge(searchParams.get('age') || 'all')
    setBrand(searchParams.get('brand') || 'all')
    setAvailableOnly(searchParams.get('available') === 'true')
    setPromotionOnly(searchParams.get('promotion') === 'true')
    setNewOnly(searchParams.get('new') === 'true')
    setPage(0)
  }, [searchParams])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchProducts({
      search: search || undefined,
      category: category === 'all' ? undefined : category,
      age: age === 'all' ? undefined : age,
      brand: brand === 'all' ? undefined : brand,
      available: availableOnly || undefined,
      promotion: promotionOnly || undefined,
      newProduct: newOnly || undefined,
      maxPrice,
      page,
      size: PAGE_SIZE,
      sort,
    })
      .then((data) => active && setResult(data))
      .catch((requestError) => active && setError(readApiError(requestError, t('apiUnavailable'))))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [age, availableOnly, brand, category, maxPrice, newOnly, page, promotionOnly, retryKey, search, sort, t])

  const products = useMemo(() => result.content.map((product) => localizeProduct(product, locale)), [locale, result.content])

  function updateCategory(value) {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('category'); else next.set('category', value)
    setSearchParams(next)
    setPage(0)
  }

  function updateLocal(setter, value) {
    setter(value)
    setPage(0)
  }

  function clearFilters() {
    setSearchParams({})
    setAge('all'); setBrand('all'); setAvailableOnly(false)
    setPromotionOnly(false); setNewOnly(false); setMaxPrice(5000); setSort('featured'); setPage(0)
  }

  const filterContent = (
    <>
      <div className="filter-title-row"><h2>{t('filter')}</h2><button type="button" onClick={clearFilters}><RotateCcw size={15} />{t('reset')}</button></div>
      <fieldset className="filter-group"><legend>{t('category')}</legend>
        <label><input type="radio" name="category" checked={category === 'all'} onChange={() => updateCategory('all')} />{t('all')}</label>
        {categories.map((item) => <label key={item.slug}><input type="radio" name="category" checked={category === item.slug} onChange={() => updateCategory(item.slug)} />{item.name}</label>)}
      </fieldset>
      <fieldset className="filter-group"><legend>{t('recommendedAge')}</legend><select value={age} onChange={(event) => updateLocal(setAge, event.target.value)}><option value="all">{t('allAges')}</option>{ageRanges.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></fieldset>
      <fieldset className="filter-group"><legend>{t('brand')}</legend><select value={brand} onChange={(event) => updateLocal(setBrand, event.target.value)}><option value="all">{t('allBrands')}</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></fieldset>
      <fieldset className="filter-group"><legend>{t('maximumPrice')}</legend><div className="price-range-label"><span>0 DH</span><strong>{maxPrice} DH</strong></div><input className="price-range" type="range" min="100" max="5000" step="100" value={maxPrice} onChange={(event) => updateLocal(setMaxPrice, Number(event.target.value))} /></fieldset>
      <fieldset className="filter-group checkbox-group"><legend>{t('options')}</legend>
        <label><input type="checkbox" checked={availableOnly} onChange={(event) => updateLocal(setAvailableOnly, event.target.checked)} />{t('availableOnly')}</label>
        <label><input type="checkbox" checked={promotionOnly} onChange={(event) => updateLocal(setPromotionOnly, event.target.checked)} />{t('promotionOnly')}</label>
        <label><input type="checkbox" checked={newOnly} onChange={(event) => updateLocal(setNewOnly, event.target.checked)} />{t('newOnly')}</label>
      </fieldset>
    </>
  )

  const selectedCategory = categories.find((item) => item.slug === category)

  return (
    <div className="catalog-page">
      <div className="catalog-banner"><div className="site-container"><nav className="breadcrumbs"><Link to="/">{t('home')}</Link><ChevronRight size={15} /><span>{t('toys')}</span></nav><h1>{search ? `${t('search')} « ${search} »` : selectedCategory?.name || t('allToys')}</h1><p>{t('catalogIntro')}</p></div></div>
      {error && <div className="catalog-state error site-container"><p>{error}</p><button className="button button-primary" onClick={() => setRetryKey((current) => current + 1)}>{t('retry')}</button></div>}
      {!error && <div className="site-container catalog-layout">
        <aside className="filter-sidebar">{filterContent}</aside>
        <section className="catalog-results">
          <div className="catalog-toolbar"><div><strong>{result.totalElements}</strong> {result.totalElements === 1 ? t('product') : t('products')}</div><div className="toolbar-actions"><button className="mobile-filter-button" type="button" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={18} />{t('filter')}</button><label><span>{t('sortBy')}</span><select value={sort} onChange={(event) => updateLocal(setSort, event.target.value)}><option value="featured">{t('recommended')}</option><option value="popular">{t('popular')}</option><option value="new">{t('newProducts')}</option><option value="price-asc">{t('priceAsc')}</option><option value="price-desc">{t('priceDesc')}</option><option value="promotion">{t('promotions')}</option></select></label></div></div>
          {loading ? <div className="catalog-state"><span className="loading-spinner" />{t('loading')}</div> : products.length > 0 ? <><div className="product-grid catalog-products">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>{result.totalPages > 1 && <nav className="pagination" aria-label={t('pagination')}><button type="button" disabled={page === 0} onClick={() => { setPage((current) => Math.max(0, current - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><ChevronLeft size={18} />{t('previous')}</button><span>{t('page')} {page + 1} / {result.totalPages}</span><button type="button" disabled={page + 1 >= result.totalPages} onClick={() => { setPage((current) => current + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{t('next')}<ChevronRight size={18} /></button></nav>}</> : <div className="empty-results"><span>🪁</span><h2>{t('noToy')}</h2><p>{t('changeFilters')}</p><button className="button button-primary" type="button" onClick={clearFilters}>{t('showAll')}</button></div>}
        </section>
      </div>}
      {filtersOpen && <div className="mobile-filter-drawer" role="dialog" aria-modal="true"><button className="drawer-backdrop" aria-label={t('close')} onClick={() => setFiltersOpen(false)} /><div className="mobile-filter-panel"><div className="mobile-filter-header"><h2>{t('filter')}</h2><button onClick={() => setFiltersOpen(false)}><X /></button></div><div className="mobile-filter-content">{filterContent}</div><button className="button button-primary mobile-apply" onClick={() => setFiltersOpen(false)}>{result.totalElements} {t('products')}</button></div></div>}
    </div>
  )
}

export default ProductsPage
