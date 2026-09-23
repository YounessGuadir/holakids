import { Clock3, Instagram, MapPin, MessageCircle, Navigation, Phone, Store } from 'lucide-react'
import { useLocale } from '../context/LocaleContext'
import { localizedStore } from '../utils/localize'
import { createWhatsAppLink } from '../utils/whatsapp'

function ContactPage() {
  const { locale, t } = useLocale()
  const store = localizedStore(locale)
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="site-container">
          <span className="hero-pill"><Store size={17} /> {t('storeAtSale')}</span>
          <h1>{t('questionToy')}<br /><em>{t('letsTalk')}</em></h1>
          <p>{t('confirmAvailability')}</p>
        </div>
      </section>

      <section className="site-container contact-grid">
        <article className="contact-main-card">
          <div className="contact-card-icon whatsapp"><MessageCircle /></div>
          <span>{t('fastest')}</span>
          <h2>{t('whatsappWrite')}</h2>
          <p>{t('heroDescription')}</p>
          <a className="button whatsapp-button" href={createWhatsAppLink(null, locale)} target="_blank" rel="noreferrer">
            <MessageCircle size={20} /> {t('openWhatsApp')}
          </a>
        </article>

        <div className="contact-info-stack">
          <article>
            <MapPin /><div><span>{t('address')}</span><strong>{store.address}</strong></div>
          </article>
          <article>
            <Phone /><div><span>{t('phone')}</span><a href={`tel:${store.phoneInternational}`}>{store.phoneDisplay}</a></div>
          </article>
          <article>
            <Clock3 /><div><span>{t('schedules')}</span><strong>{t('contactBefore')}</strong></div>
          </article>
          <article>
            <Instagram /><div><span>Instagram</span><strong>{t('soon')}</strong></div>
          </article>
        </div>
      </section>

      <section className="site-container map-placeholder">
        <div><Navigation /></div>
        <h2>Salé – Hay Chemaâou</h2>
        <p>Route Al Mahdia – Maroc</p>
        <span>{t('mapConfig')}</span>
      </section>
    </div>
  )
}

export default ContactPage
