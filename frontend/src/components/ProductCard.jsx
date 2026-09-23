import { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import AvailabilityBadge from './AvailabilityBadge'
import { formatPrice } from '../utils/format'
import { createWhatsAppLink } from '../utils/whatsapp'
import SafeImage from './SafeImage'

function ProductCard({ product }) {
  const { locale, t } = useLocale()
  const [favorite, setFavorite] = useState(false)
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <div className="product-badges">
          {product.newProduct && <span className="product-badge new">{t('newBadge')}</span>}
          {product.promotion && <span className="product-badge promo">-{discount}%</span>}
        </div>
        <button
          type="button"
          className={`favorite-button ${favorite ? 'active' : ''}`}
          aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={favorite}
          onClick={() => setFavorite((current) => !current)}
        >
          <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
        </button>
        <Link to={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <SafeImage src={product.image} alt={product.shortName} loading="lazy" />
        </Link>
      </div>

      <div className="product-card-content">
        <p className="product-brand">{product.brand}</p>
        <Link className="product-name" to={`/products/${product.slug}`}>
          {product.shortName}
        </Link>
        <p className="product-age">{t('fromAge')} {product.ageLabel}</p>
        <AvailabilityBadge status={product.availability} compact />

        <div className="product-price-row">
          <div>
            <strong>{formatPrice(product.price)} DH</strong>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)} DH</del>}
          </div>
          <a
            className="quick-whatsapp"
            href={createWhatsAppLink(product, locale)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Demander ${product.shortName} sur WhatsApp`}
          >
            <MessageCircle size={21} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
