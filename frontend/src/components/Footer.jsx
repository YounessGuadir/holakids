import { Clock3, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useLocale } from '../context/LocaleContext'
import { localizedStore } from '../utils/localize'
import { createWhatsAppLink } from '../utils/whatsapp'
import Logo from './Logo'

function Footer() {
  const { categories } = useCatalog()
  const { locale, t } = useLocale()
  const store = localizedStore(locale)
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-brand"><Logo compact /><p>{t('footerDescription')}</p><div className="footer-socials"><a href={createWhatsAppLink(null, locale)} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={20} /></a><Link to="/#instagram" aria-label="Instagram"><Instagram size={20} /></Link></div></div>
        <div><h3>{t('exploreFooter')}</h3><ul><li><Link to="/products">{t('allToys')}</Link></li><li><Link to="/products?promotion=true">{t('promotions')}</Link></li><li><Link to="/products?new=true">{t('newProducts')}</Link></li><li><Link to="/contact">{t('contactUs')}</Link></li></ul></div>
        <div><h3>{t('categories')}</h3><ul>{categories.slice(0, 5).map((category) => <li key={category.slug}><Link to={`/products?category=${category.slug}`}>{category.name}</Link></li>)}</ul></div>
        <div className="footer-contact"><h3>{t('store')}</h3><p><MapPin size={18} />{store.address}</p><a href={`tel:${store.phoneInternational}`}><Phone size={18} />{store.phoneDisplay}</a><p><Clock3 size={18} />{t('schedulePhone')}</p></div>
      </div>
      <div className="site-container footer-bottom"><span>© {new Date().getFullYear()} HOLAKIDS. {t('rights')}</span><span>{t('noPayment')}</span></div>
    </footer>
  )
}

export default Footer
