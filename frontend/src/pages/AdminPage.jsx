import { useCallback, useEffect, useMemo, useState } from 'react'
import { Boxes, Eye, EyeOff, FolderCog, ImagePlus, PackageCheck, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react'
import {
  createCategory, createProduct, deleteCategory, deleteProduct, fetchAdminCategories,
  fetchAdminProducts, updateCategory, updateProduct, updateProductAvailability,
  updateProductStock, uploadProductImage,
} from '../api/adminApi'
import { readApiError } from '../api/client'
import AvailabilityBadge from '../components/AvailabilityBadge'
import SafeImage from '../components/SafeImage'
import { useCatalog } from '../context/CatalogContext'
import { useLocale } from '../context/LocaleContext'
import { formatPrice, normalizeSearch } from '../utils/format'

const emptyForm = {
  externalId: '', slug: '', sku: '', nameFr: '', nameAr: '', shortNameFr: '', shortNameAr: '',
  descriptionFr: '', descriptionAr: '', brand: '', subCategoryFr: '', subCategoryAr: '',
  ageRange: '3-5', ageMin: 3, ageMax: 5, genderTarget: 'UNISEX', rating: 0, reviewCount: 0,
  price: '', oldPrice: '', stock: 0, promotion: false, newProduct: true, featured: false, active: true,
  primaryImageUrl: '', imageUrls: '', categoryId: '', featuresFr: '', featuresAr: '', attributes: '',
}

const emptyCategory = {
  slug: '', nameFr: '', nameAr: '', descriptionFr: '', descriptionAr: '',
  imageUrl: '/images/products/placeholder-toy.svg', color: '#eef5ff', displayOrder: 1, active: true,
}

function AdminPage() {
  const { refresh: refreshPublicCatalog } = useCatalog()
  const { t } = useLocale()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [categoryForm, setCategoryForm] = useState(emptyCategory)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [nextProducts, nextCategories] = await Promise.all([fetchAdminProducts(), fetchAdminCategories()])
      setProducts(nextProducts)
      setCategories(nextCategories)
    } catch (requestError) {
      setError(readApiError(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const stats = useMemo(() => ({
    total: products.length,
    available: products.filter((product) => product.stock > 0 && product.active).length,
    unavailable: products.filter((product) => product.stock <= 0 || !product.active).length,
  }), [products])

  const visibleProducts = useMemo(() => {
    const query = normalizeSearch(search)
    return products.filter((product) => {
      const matchesSearch = !query || normalizeSearch(`${product.nameFr} ${product.nameAr} ${product.sku} ${product.brand}`).includes(query)
      const matchesStock = stockFilter === 'all'
        || (stockFilter === 'available' && product.stock > 0 && product.active)
        || (stockFilter === 'unavailable' && (product.stock <= 0 || !product.active))
      return matchesSearch && matchesStock
    })
  }, [products, search, stockFilter])

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm, categoryId: categories.find((category) => category.active)?.id || '' })
    setError(''); setNotice(''); setFormOpen(true); setCategoryFormOpen(false)
  }

  function openEdit(product) {
    setEditingId(product.id)
    setForm({
      externalId: product.externalId || '', slug: product.slug, sku: product.sku,
      nameFr: product.nameFr, nameAr: product.nameAr, shortNameFr: product.shortNameFr, shortNameAr: product.shortNameAr,
      descriptionFr: product.descriptionFr, descriptionAr: product.descriptionAr, brand: product.brand,
      subCategoryFr: product.subCategoryFr || '', subCategoryAr: product.subCategoryAr || '',
      ageRange: product.ageRange, ageMin: product.ageMin ?? '', ageMax: product.ageMax ?? '',
      genderTarget: product.genderTarget || 'UNISEX', rating: product.rating || 0, reviewCount: product.reviewCount || 0,
      price: product.price, oldPrice: product.oldPrice || '', stock: product.stock, promotion: product.promotion,
      newProduct: product.newProduct, featured: product.featured, active: product.active,
      primaryImageUrl: product.primaryImageUrl, categoryId: product.category.id,
      imageUrls: (product.images || []).map((image) => image.url).filter((url) => url !== product.primaryImageUrl).join('\n'),
      featuresFr: product.features.map((feature) => feature.textFr).join('\n'),
      featuresAr: product.features.map((feature) => feature.textAr).join('\n'),
      attributes: (product.attributes || []).map((attribute) => `${attribute.name}|${attribute.valueFr}|${attribute.valueAr}`).join('\n'),
    })
    setError(''); setNotice(''); setFormOpen(true); setCategoryFormOpen(false)
  }

  function setField(name, value) { setForm((current) => ({ ...current, [name]: value })) }

  function buildPayload() {
    const fr = form.featuresFr.split('\n').map((value) => value.trim()).filter(Boolean)
    const ar = form.featuresAr.split('\n').map((value) => value.trim()).filter(Boolean)
    const features = Array.from({ length: Math.max(fr.length, ar.length) }, (_, index) => ({
      textFr: fr[index] || ar[index], textAr: ar[index] || fr[index],
    }))
    const gallery = [form.primaryImageUrl, ...form.imageUrls.split('\n')]
      .map((value) => value.trim()).filter((value, index, values) => value && values.indexOf(value) === index)
    const attributes = form.attributes.split('\n').map((line) => {
      const [name, valueFr, valueAr] = line.split('|').map((part) => part?.trim())
      return name && valueFr ? { name, valueFr, valueAr: valueAr || valueFr } : null
    }).filter(Boolean)
    return {
      ...form,
      externalId: form.externalId || null,
      subCategoryFr: form.subCategoryFr || null,
      subCategoryAr: form.subCategoryAr || null,
      ageMin: form.ageMin === '' ? null : Number(form.ageMin),
      ageMax: form.ageMax === '' ? null : Number(form.ageMax),
      rating: Number(form.rating || 0), reviewCount: Number(form.reviewCount || 0),
      price: Number(form.price), oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
      stock: Number(form.stock), categoryId: Number(form.categoryId), features, attributes,
      images: gallery.map((url) => ({ url, altFr: form.shortNameFr, altAr: form.shortNameAr })),
    }
  }

  async function reloadAfterMutation() {
    await loadData()
    await refreshPublicCatalog()
  }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      const payload = buildPayload()
      if (editingId) await updateProduct(editingId, payload); else await createProduct(payload)
      await reloadAfterMutation(); setNotice(t('productSaved')); setFormOpen(false)
    } catch (requestError) { setError(readApiError(requestError)) }
    finally { setSaving(false) }
  }

  async function remove(product) {
    if (!window.confirm(t('deleteConfirm'))) return
    setError(''); setNotice('')
    try { await deleteProduct(product.id); await reloadAfterMutation(); setNotice(t('productDeleted')) }
    catch (requestError) { setError(readApiError(requestError)) }
  }

  async function changeStock(product, amount) {
    try { await updateProductStock(product.id, Math.max(0, product.stock + amount)); await loadData() }
    catch (requestError) { setError(readApiError(requestError)) }
  }

  async function toggleActive(product) {
    try { await updateProductAvailability(product.id, !product.active); await reloadAfterMutation() }
    catch (requestError) { setError(readApiError(requestError)) }
  }

  async function upload(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setUploading(true); setError('')
    try {
      const urls = []
      for (const file of files) urls.push(await uploadProductImage(file))
      setForm((current) => ({
        ...current,
        primaryImageUrl: current.primaryImageUrl || urls[0],
        imageUrls: [current.imageUrls, ...urls.slice(current.primaryImageUrl ? 0 : 1)].filter(Boolean).join('\n'),
      }))
    } catch (requestError) { setError(readApiError(requestError)) }
    finally { setUploading(false) }
  }

  function openCreateCategory() {
    setEditingCategoryId(null)
    setCategoryForm({ ...emptyCategory, displayOrder: categories.length + 1 })
    setCategoryFormOpen(true); setFormOpen(false); setError(''); setNotice('')
  }

  function openEditCategory(category) {
    setEditingCategoryId(category.id)
    setCategoryForm({
      slug: category.slug, nameFr: category.nameFr, nameAr: category.nameAr,
      descriptionFr: category.descriptionFr, descriptionAr: category.descriptionAr,
      imageUrl: category.imageUrl, color: category.color, displayOrder: category.displayOrder, active: category.active,
    })
    setCategoryFormOpen(true); setFormOpen(false); setError(''); setNotice('')
  }

  function setCategoryField(name, value) { setCategoryForm((current) => ({ ...current, [name]: value })) }

  async function submitCategory(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      const payload = { ...categoryForm, displayOrder: Number(categoryForm.displayOrder) }
      if (editingCategoryId) await updateCategory(editingCategoryId, payload); else await createCategory(payload)
      await reloadAfterMutation(); setCategoryFormOpen(false); setNotice(t('categorySaved'))
    } catch (requestError) { setError(readApiError(requestError)) }
    finally { setSaving(false) }
  }

  async function removeCategory(category) {
    if (!window.confirm(t('categoryDeleteConfirm'))) return
    try { await deleteCategory(category.id); await reloadAfterMutation(); setNotice(t('categoryDisabled')) }
    catch (requestError) { setError(readApiError(requestError)) }
  }

  return (
    <div className="admin-page site-container">
      <div className="admin-heading">
        <div><p className="section-eyebrow">HOLAKIDS Admin</p><h1>{t('adminDashboard')}</h1><p>Spring Boot API · PostgreSQL · JWT · {products.length} {t('products')}</p></div>
        <div className="admin-heading-actions"><button className="button button-light" onClick={openCreateCategory}><FolderCog size={19} />{t('manageCategories')}</button><button className="button button-primary" onClick={openCreate}><Plus size={19} />{t('addProduct')}</button></div>
      </div>
      <div className="admin-stats"><article><Boxes /><span>{t('products')}</span><strong>{stats.total}</strong></article><article><PackageCheck /><span>{t('availableShort')}</span><strong>{stats.available}</strong></article><article><X /><span>{t('outOfStockShort')}</span><strong>{stats.unavailable}</strong></article></div>
      {error && <div className="form-alert" role="alert">{error}</div>}{notice && <div className="form-notice">{notice}</div>}

      {categoryFormOpen && <section className="admin-form-card">
        <div className="admin-form-title"><h2>{editingCategoryId ? t('editCategory') : t('addCategory')}</h2><button onClick={() => setCategoryFormOpen(false)} aria-label={t('cancel')}><X /></button></div>
        <form className="product-admin-form" onSubmit={submitCategory}>
          <label><span>{t('nameFr')}</span><input required value={categoryForm.nameFr} onChange={(event) => setCategoryField('nameFr', event.target.value)} /></label>
          <label><span>{t('nameAr')}</span><input required dir="rtl" value={categoryForm.nameAr} onChange={(event) => setCategoryField('nameAr', event.target.value)} /></label>
          <label><span>{t('slug')}</span><input required value={categoryForm.slug} onChange={(event) => setCategoryField('slug', event.target.value)} /></label>
          <label><span>{t('displayOrder')}</span><input type="number" min="1" required value={categoryForm.displayOrder} onChange={(event) => setCategoryField('displayOrder', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('descriptionFr')}</span><textarea required value={categoryForm.descriptionFr} onChange={(event) => setCategoryField('descriptionFr', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('descriptionAr')}</span><textarea required dir="rtl" value={categoryForm.descriptionAr} onChange={(event) => setCategoryField('descriptionAr', event.target.value)} /></label>
          <label><span>{t('imageUrl')}</span><input required value={categoryForm.imageUrl} onChange={(event) => setCategoryField('imageUrl', event.target.value)} /></label>
          <label><span>{t('color')}</span><input type="color" value={categoryForm.color} onChange={(event) => setCategoryField('color', event.target.value)} /></label>
          <div className="admin-checks"><label><input type="checkbox" checked={categoryForm.active} onChange={(event) => setCategoryField('active', event.target.checked)} />{t('active')}</label></div>
          <div className="admin-form-actions"><button type="button" className="button button-light" onClick={() => setCategoryFormOpen(false)}>{t('cancel')}</button><button className="button button-primary" disabled={saving}><Save size={18} />{t('saveProduct')}</button></div>
        </form>
        <div className="admin-category-list">{categories.map((category) => <article key={category.id}><SafeImage src={category.imageUrl} alt="" /><div><strong>{category.nameFr}</strong><small>{category.slug} · {category.active ? t('active') : t('disabled')}</small></div><button onClick={() => openEditCategory(category)}><Pencil size={17} /></button><button className="danger" onClick={() => removeCategory(category)}><Trash2 size={17} /></button></article>)}</div>
      </section>}

      {formOpen && <section className="admin-form-card">
        <div className="admin-form-title"><h2>{editingId ? t('edit') : t('addProduct')}</h2><button onClick={() => setFormOpen(false)} aria-label={t('cancel')}><X /></button></div>
        <form className="product-admin-form" onSubmit={submit}>
          <label><span>{t('nameFr')}</span><input required value={form.nameFr} onChange={(event) => setField('nameFr', event.target.value)} /></label>
          <label><span>{t('nameAr')}</span><input required dir="rtl" value={form.nameAr} onChange={(event) => setField('nameAr', event.target.value)} /></label>
          <label><span>{t('shortNameFr')}</span><input required value={form.shortNameFr} onChange={(event) => setField('shortNameFr', event.target.value)} /></label>
          <label><span>{t('shortNameAr')}</span><input required dir="rtl" value={form.shortNameAr} onChange={(event) => setField('shortNameAr', event.target.value)} /></label>
          <label><span>{t('sku')}</span><input required value={form.sku} onChange={(event) => setField('sku', event.target.value)} /></label>
          <label><span>{t('slug')}</span><input required value={form.slug} onChange={(event) => setField('slug', event.target.value)} /></label>
          <label><span>External ID</span><input value={form.externalId} onChange={(event) => setField('externalId', event.target.value)} /></label>
          <label><span>{t('brand')}</span><input required value={form.brand} onChange={(event) => setField('brand', event.target.value)} /></label>
          <label><span>{t('category')}</span><select required value={form.categoryId} onChange={(event) => setField('categoryId', event.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.nameFr}</option>)}</select></label>
          <label><span>{t('subCategoryFr')}</span><input value={form.subCategoryFr} onChange={(event) => setField('subCategoryFr', event.target.value)} /></label>
          <label><span>{t('subCategoryAr')}</span><input dir="rtl" value={form.subCategoryAr} onChange={(event) => setField('subCategoryAr', event.target.value)} /></label>
          <label><span>{t('recommendedAge')}</span><select value={form.ageRange} onChange={(event) => setField('ageRange', event.target.value)}><option value="0-2">0–2</option><option value="3-5">3–5</option><option value="6-8">6–8</option><option value="9-11">9–11</option><option value="12+">12+</option></select></label>
          <label><span>{t('ageMin')}</span><input type="number" min="0" value={form.ageMin} onChange={(event) => setField('ageMin', event.target.value)} /></label>
          <label><span>{t('ageMax')}</span><input type="number" min="0" value={form.ageMax} onChange={(event) => setField('ageMax', event.target.value)} /></label>
          <label><span>{t('genderTarget')}</span><select value={form.genderTarget} onChange={(event) => setField('genderTarget', event.target.value)}><option value="UNISEX">UNISEX</option><option value="GIRLS">GIRLS</option><option value="BOYS">BOYS</option></select></label>
          <label><span>{t('rating')}</span><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setField('rating', event.target.value)} /></label>
          <label><span>{t('reviewCount')}</span><input type="number" min="0" value={form.reviewCount} onChange={(event) => setField('reviewCount', event.target.value)} /></label>
          <label><span>{t('price')} (DH)</span><input type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setField('price', event.target.value)} /></label>
          <label><span>{t('oldPrice')} (DH)</span><input type="number" min="0" step="0.01" value={form.oldPrice} onChange={(event) => setField('oldPrice', event.target.value)} /></label>
          <label><span>{t('stock')}</span><input type="number" min="0" required value={form.stock} onChange={(event) => setField('stock', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('descriptionFr')}</span><textarea required rows="3" value={form.descriptionFr} onChange={(event) => setField('descriptionFr', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('descriptionAr')}</span><textarea required rows="3" dir="rtl" value={form.descriptionAr} onChange={(event) => setField('descriptionAr', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('features')} FR</span><textarea rows="4" value={form.featuresFr} onChange={(event) => setField('featuresFr', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('features')} AR</span><textarea rows="4" dir="rtl" value={form.featuresAr} onChange={(event) => setField('featuresAr', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('attributes')} — nom|valeur FR|valeur AR</span><textarea rows="4" value={form.attributes} onChange={(event) => setField('attributes', event.target.value)} /></label>
          <label className="admin-wide"><span>{t('imageUrl')}</span><div className="admin-image-field"><input required value={form.primaryImageUrl} onChange={(event) => setField('primaryImageUrl', event.target.value)} /><label className="button button-light upload-button"><ImagePlus size={18} />{uploading ? t('loading') : t('uploadImage')}<input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={upload} hidden /></label></div></label>
          <label className="admin-wide"><span>{t('galleryImages')}</span><textarea rows="3" value={form.imageUrls} onChange={(event) => setField('imageUrls', event.target.value)} /></label>
          {form.primaryImageUrl && <div className="admin-image-preview"><SafeImage src={form.primaryImageUrl} alt="" /></div>}
          <div className="admin-checks"><label><input type="checkbox" checked={form.active} onChange={(event) => setField('active', event.target.checked)} />{t('active')}</label><label><input type="checkbox" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} />{t('featured')}</label><label><input type="checkbox" checked={form.promotion} onChange={(event) => setField('promotion', event.target.checked)} />{t('promotions')}</label><label><input type="checkbox" checked={form.newProduct} onChange={(event) => setField('newProduct', event.target.checked)} />{t('newProducts')}</label></div>
          <div className="admin-form-actions"><button type="button" className="button button-light" onClick={() => setFormOpen(false)}>{t('cancel')}</button><button className="button button-primary" disabled={saving || uploading}><Save size={18} />{saving ? t('loading') : t('saveProduct')}</button></div>
        </form>
      </section>}

      <section className="admin-table-card">
        <div className="admin-table-toolbar"><div className="admin-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('searchPlaceholder')} /></div><select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}><option value="all">{t('all')}</option><option value="available">{t('availableShort')}</option><option value="unavailable">{t('outOfStockShort')}</option></select><strong>{visibleProducts.length} {t('products')}</strong></div>
        <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>{t('product')}</th><th>{t('category')}</th><th>{t('price')}</th><th>{t('stock')}</th><th>{t('actions')}</th></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product.id}><td><div className="admin-product-cell"><SafeImage src={product.primaryImageUrl} alt="" /><div><strong>{product.nameFr}</strong><small>{product.sku}</small></div></div></td><td>{product.category.nameFr}</td><td>{formatPrice(product.price)} DH</td><td><div className="admin-stock-control"><button onClick={() => changeStock(product, -1)}>-</button><span>{product.stock}</span><button onClick={() => changeStock(product, 1)}>+</button><AvailabilityBadge status={product.availability} compact /></div></td><td><div className="admin-row-actions"><button onClick={() => toggleActive(product)} aria-label={product.active ? t('disable') : t('enable')}>{product.active ? <Eye size={17} /> : <EyeOff size={17} />}</button><button onClick={() => openEdit(product)} aria-label={t('edit')}><Pencil size={17} /></button><button className="danger" onClick={() => remove(product)} aria-label={t('delete')}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div>{loading && <div className="page-loader">{t('loading')}</div>}
      </section>
    </div>
  )
}

export default AdminPage
