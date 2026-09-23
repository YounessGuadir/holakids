import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react'
import { useLocale } from '../context/LocaleContext'

const icons = {
  AVAILABLE: CircleCheck,
  LOW_STOCK: TriangleAlert,
  OUT_OF_STOCK: CircleX,
}

function AvailabilityBadge({ status, compact = false }) {
  const { t } = useLocale()
  const config = {
    AVAILABLE: { label: t('available'), shortLabel: t('availableShort'), tone: 'available' },
    LOW_STOCK: { label: t('lowStock'), shortLabel: t('lowStockShort'), tone: 'low' },
    OUT_OF_STOCK: { label: t('outOfStock'), shortLabel: t('outOfStockShort'), tone: 'out' },
  }[status] || { label: t('outOfStock'), shortLabel: t('outOfStockShort'), tone: 'out' }
  const Icon = icons[status] || CircleX

  return (
    <span className={`availability-badge ${config.tone} ${compact ? 'compact' : ''}`}>
      <Icon size={compact ? 13 : 16} strokeWidth={2.5} aria-hidden="true" />
      {compact ? config.shortLabel : config.label}
    </span>
  )
}

export default AvailabilityBadge
