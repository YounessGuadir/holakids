import {
  ArrowRight, BadgeCheck, Clock3, Instagram, MapPin, MessageCircle,
  ShieldCheck, Sparkles, Store,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { useCatalog } from '../context/CatalogContext'
import { useLocale } from '../context/LocaleContext'
import { localizedAgeRanges, localizedStore } from '../utils/localize'
import { createWhatsAppLink } from '../utils/whatsapp'
import SafeImage from '../components/SafeImage'

function HomePage() {
  const { products, categories, brands, loading, error, refresh } = useCatalog()
  const { locale, t } = useLocale()
  const store = localizedStore(locale)
  const ageRanges = localizedAgeRanges(locale)
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8)
  const newProducts = products.filter((product) => product.newProduct).slice(0, 4)

  return (
    <>
      <section className="home-hero">
        <SafeImage className="hero-background" src="/images/hero-holakids.png" alt="HOLAKIDS" />
        <div className="hero-overlay" />
        <div className="site-container hero-content">
          <span className="hero-pill"><Sparkles size={17} /> {t('heroPill')}</span>
          <h1>{t('heroTitle')} <em>{t('heroAccent')}</em></h1>
          <p>{t('heroDescription')}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/products">{t('discoverToys')}<ArrowRight size={19} /></Link>
            <a className="button button-light" href={createWhatsAppLink(null, locale)} target="_blank" rel="noreferrer"><MessageCircle size={19} />{t('whatsappWrite')}</a>
          </div>
        </div>
      </section>

      <section className="service-ribbon">
        <div className="site-container service-ribbon-grid">
          <div><BadgeCheck /><span><strong>{t('stockStore')}</strong><small>{t('clearAvailability')}</small></span></div>
          <div><MessageCircle /><span><strong>{t('whatsappReply')}</strong><small>{t('simpleDirect')}</small></span></div>
          <div><Store /><span><strong>{t('pickupStore')}</strong><small>{t('atSale')}</small></span></div>
          <div><ShieldCheck /><span><strong>{t('personalizedAdvice')}</strong><small>{t('chooseWell')}</small></span></div>
        </div>
      </section>

      {loading && <div className="catalog-state site-container"><span className="loading-spinner" />{t('loading')}</div>}
      {error && <div className="catalog-state error site-container"><p>{t('apiUnavailable')}</p><button className="button button-primary" onClick={refresh}>{t('retry')}</button></div>}

      {!loading && !error && (
        <>
          <section className="content-section" id="categories">
            <div className="site-container">
              <SectionHeading eyebrow={t('explore')} title={t('favoriteWorlds')} description={t('categoryDescription')} link="/products" />
              <div className="category-grid">
                {categories.map((category) => (
                  <Link className="category-card" key={category.slug} to={`/products?category=${category.slug}`} style={{ '--category-color': category.color }}>
                    <div className="category-image"><SafeImage src={category.image} alt={category.name} loading="lazy" /></div>
                    <div><h3>{category.name}</h3><p>{category.description}</p></div><span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="content-section age-section">
            <div className="site-container">
              <SectionHeading eyebrow={t('rightChoice')} title={t('toysByAge')} description={t('ageDescription')} />
              <div className="age-grid">
                {ageRanges.map((age) => <Link key={age.value} to={`/products?age=${encodeURIComponent(age.value)}`}><span>{age.emoji}</span><strong>{age.label}</strong><small>{t('discover')}</small></Link>)}
              </div>
            </div>
          </section>

          <section className="content-section products-section">
            <div className="site-container">
              <SectionHeading eyebrow={t('favorites')} title={t('selectionTitle')} description={t('selectionDescription')} link="/products" linkLabel={t('viewCatalog')} />
              <div className="product-grid home-products">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            </div>
          </section>

          <section className="content-section promo-section">
            <div className="site-container promo-grid">
              <article className="promo-panel promo-panel-main"><div className="promo-copy"><span>{t('currentOffers')}</span><h2>{t('promoTitle')}</h2><p>{t('promoDescription')}</p><Link className="button button-white" to="/products?promotion=true">{t('seePromotions')} <ArrowRight size={18} /></Link></div><SafeImage src="/images/products/racing-car.png" alt="" /></article>
              <article className="promo-panel promo-panel-secondary"><div className="promo-copy"><span>{t('newProducts')}</span><h2>{t('creativeTitle')}</h2><p>{t('creativeDescription')}</p><Link className="text-button" to="/products?new=true">{t('discover')} <ArrowRight size={17} /></Link></div><SafeImage src="/images/products/art-kit.png" alt="" /></article>
            </div>
          </section>

          <section className="content-section products-section new-section">
            <div className="site-container"><SectionHeading eyebrow={t('justArrived')} title={t('latestTitle')} description={t('latestDescription')} link="/products?new=true" /><div className="product-grid home-products">{newProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>
          </section>

          <section className="content-section brand-section">
            <div className="site-container"><SectionHeading eyebrow={t('discoverBrands')} title={t('brandsTitle')} description={t('brandsDescription')} /><div className="brand-list">{brands.map((brand, index) => <Link key={brand} to={`/products?brand=${encodeURIComponent(brand)}`}><span className={`brand-dot tone-${(index % 5) + 1}`} />{brand}</Link>)}</div></div>
          </section>
        </>
      )}

      <section className="content-section store-section" id="instagram">
        <div className="site-container store-grid">
          <div className="store-card location-card"><div className="store-icon"><MapPin /></div><div><span>{t('storeAtSale')}</span><h2>{t('visitUs')}</h2><p>{store.address}</p><div className="store-meta"><Clock3 size={17} />{t('schedulePhone')}</div><Link className="button button-primary" to="/contact">{t('storeInfo')}</Link></div></div>
          <div className="store-card instagram-card"><div className="instagram-decoration"><span>H</span><span>O</span><span>L</span><span>A</span></div><div><span><Instagram size={18} /> Instagram</span><h2>HOLAKIDS</h2><p>{t('instagramText')}</p><button type="button" disabled>{t('soon')}</button></div></div>
        </div>
      </section>
    </>
  )
}

export default HomePage
