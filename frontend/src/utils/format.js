export function formatPrice(value) {
  return new Intl.NumberFormat('fr-MA', {
    maximumFractionDigits: 0,
  }).format(value)
}

export function normalizeSearch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

