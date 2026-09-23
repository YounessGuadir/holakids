import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronRight, Copy, MessageCircle, PackageCheck, Phone, ShieldCheck, Star, Store } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct, fetchRelatedProducts } from '../api/catalogApi'
import { readApiError } from '../api/client'
import AvailabilityBadge from '../components/AvailabilityBadge'
import ProductCard from '../components/ProductCard'
import SafeImage from '../components/SafeImage'
import SectionHeading from '../components/SectionHeading'
import { useLocale } from '../context/LocaleContext'
import { formatPrice } from '../utils/format'
import { localizeProduct, localizedStore } from '../utils/localize'
import { createWhatsAppLink } from '../utils/whatsapp'

function ProductDetailPage() {
  const { slug } = useParams()
  const { locale, t } = useLocale()
  const store = localizedStore(locale)
  const [rawProduct, setRawProduct] = useState(null)
  const [rawRelated, setRawRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([fetchProduct(slug), fetchRelatedProducts(slug)])
      .then(([product, related]) => {
        if (!active) return
        setRawProduct(product)
        setRawRelated(related)
        setSelectedImage(product.primaryImageUrl)
      })
      .catch((requestError) => active && setError(readApiError(requestError)))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [slug])

  const product = useMemo(() => rawProduct ? localizeProduct(rawProduct, locale) : null, [locale, rawProduct])
  const related = useMemo(() => rawRelated.map((item) => localizeProduct(item, locale)), [locale, rawRelated])

  if (loading) return <div className="catalog-state site-container"><span className="loading-spinner" />{t('loading')}</div>
  if (error || !product) return <div className="site-container product-not-found"><span>🧸</span><h1>{t('noToy')}</h1><p>{error}</p><Link className="button button-primary" to="/products">{t('allToys')}</Link></div>

  const discount = product.discountPercentage || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0)
  const galleryImages = product.imagesLocalized.length ? product.imagesLocalized : [{ url: product.image, alt: product.name }]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true); window.setTimeout(() => setCopied(false), 1800)
    } catch { setCopied(false) }
  }

  return (
    <div className="product-detail-page"><div className="site-container">
      <nav className="breadcrumbs product-breadcrumbs"><Link to="/">{t('home')}</Link><ChevronRight size={15} /><Link to="/products">{t('toys')}</Link><ChevronRight size={15} /><Link to={`/products?category=${product.category}`}>{product.categoryLabel}</Link><ChevronRight size={15} /><span>{product.shortName}</span></nav>
      <div className="product-detail-grid">
        <section className="product-gallery">
          <div className="gallery-main"><div className="gallery-badges">{product.newProduct && <span className="product-badge new">{t('newBadge')}</span>}{product.promotion && <span className="product-badge promo">-{discount}%</span>}</div><SafeImage src={selectedImage || product.image} alt={product.name} /></div>
          <div className="gallery-thumbnails">{galleryImages.map((image, index) => <button key={`${image.url}-${index}`} className={(selectedImage || product.image) === image.url ? 'active' : ''} onClick={() => setSelectedImage(image.url)}><SafeImage src={image.url} alt={image.alt || product.name} /></button>)}</div>
        </section>
        <section className="product-summary">
          <p className="product-detail-brand">{product.brand}</p><h1>{product.name}</h1><p className="product-reference">{t('reference')} : {product.sku}</p><AvailabilityBadge status={product.availability} />
          <div className="product-rating"><Star size={18} fill="currentColor" /><strong>{Number(product.rating || 0).toFixed(1)}</strong><span>({product.reviewCount || 0} {t('reviews')})</span></div>
          <div className="product-detail-price"><strong>{formatPrice(product.price)} DH</strong>{product.oldPrice && <><del>{formatPrice(product.oldPrice)} DH</del><span>{t('save')} {formatPrice(product.oldPrice - product.price)} DH</span></>}</div>
          <p className="product-description">{product.description}</p>
          <div className="detail-facts"><div><span>{t('recommendedAge')}</span><strong>{product.ageLabel}</strong></div><div><span>{t('category')}</span><strong>{product.categoryLabel}</strong></div><div><span>{t('displayedStock')}</span><strong>{product.stock} {product.stock === 1 ? t('piece') : t('pieces')}</strong></div></div>
          <div className="product-contact-box"><h2>{t('interested')}</h2><p>{t('confirmAvailability')}</p><a className="button whatsapp-button" href={createWhatsAppLink(product, locale)} target="_blank" rel="noreferrer"><MessageCircle size={21} />{product.availability === 'OUT_OF_STOCK' ? t('askReturn') : t('contactWhatsApp')}</a><a className="phone-link" href={`tel:${store.phoneInternational}`}><Phone size={18} />{t('call')} {store.phoneDisplay}</a></div>
          <button className="copy-link-button" type="button" onClick={copyLink}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? t('linkCopied') : t('copyLink')}</button>
        </section>
      </div>
      <section className="product-information"><div><p className="section-eyebrow">{t('aboutProduct')}</p><h2>{t('features')}</h2><ul>{product.featuresLocalized.map((feature) => <li key={feature}><Check size={17} />{feature}</li>)}</ul>{product.attributesLocalized.length > 0 && <><h2 className="attributes-title">{t('attributes')}</h2><dl className="product-attributes">{product.attributesLocalized.map((attribute) => <div key={`${attribute.name}-${attribute.position}`}><dt>{t(`attribute_${attribute.name}`) === `attribute_${attribute.name}` ? attribute.name : t(`attribute_${attribute.name}`)}</dt><dd>{attribute.value}</dd></div>)}</dl></>}</div><div className="pickup-card"><Store /><h3>{t('inStore')}</h3><p>{store.address}</p><div><PackageCheck size={18} />{t('storePickup')}</div><div><ShieldCheck size={18} />{t('confirmBefore')}</div></div></section>
      {related.length > 0 && <section className="content-section related-section"><SectionHeading title={t('related')} link={`/products?category=${product.category}`} /><div className="product-grid home-products">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </div></div>
  )
}

export default ProductDetailPage
