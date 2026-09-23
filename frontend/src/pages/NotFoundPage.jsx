import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'

function NotFoundPage() {
  const { t } = useLocale()
  return (
    <div className="not-found-page site-container">
      <span>404</span>
      <h1>{t('notFoundTitle')}</h1>
      <p>{t('notFoundText')}</p>
      <Link className="button button-primary" to="/"><ArrowLeft size={18} /> {t('backHome')}</Link>
    </div>
  )
}

export default NotFoundPage
