import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import { useLocale } from '../context/LocaleContext'
import { createWhatsAppLink } from '../utils/whatsapp'

function PublicLayout() {
  const location = useLocation()
  const { locale, t } = useLocale()

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.hash, location.pathname])

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <a
        className="floating-whatsapp"
        href={createWhatsAppLink(null, locale)}
        target="_blank"
        rel="noreferrer"
        aria-label={t('contactWhatsApp')}
      >
        <MessageCircle size={25} />
        <span>{t('help')}</span>
      </a>
    </div>
  )
}

export default PublicLayout
