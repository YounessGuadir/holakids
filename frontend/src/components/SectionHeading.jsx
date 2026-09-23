import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '../context/LocaleContext'

function SectionHeading({ eyebrow, title, description, link, linkLabel }) {
  const { t } = useLocale()

  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {linkLabel || t('showAll')}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export default SectionHeading
