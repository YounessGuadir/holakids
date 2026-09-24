import { useEffect, useState } from 'react'

const FALLBACK_IMAGE = '/images/products/placeholder-toy.svg'

function resolveAssetUrl(value) {
  if (!value) return ''
  if (/^(https?:|data:|blob:)/i.test(value)) return value

  // Les images téléversées par le backend doivent utiliser le domaine Cloud Run.
  if (value.startsWith('/api/')) {
    try {
      const apiBase = new URL(import.meta.env.VITE_API_URL || '/api/v1', window.location.origin)
      return new URL(value, `${apiBase.origin}/`).toString()
    } catch {
      return value
    }
  }

  // Les images publiques de Vite vivent sous /holakids/ sur GitHub Pages.
  const publicBase = import.meta.env.BASE_URL || '/'
  const cleanBase = publicBase.endsWith('/') ? publicBase.slice(0, -1) : publicBase
  return value.startsWith('/')
    ? `${cleanBase}${value}`
    : `${cleanBase}/${value.replace(/^\.\//, '')}`
}

function SafeImage({ src, alt = '', fallback = FALLBACK_IMAGE, ...props }) {
  const resolvedFallback = resolveAssetUrl(fallback)
  const [resolvedSrc, setResolvedSrc] = useState(resolveAssetUrl(src || fallback))

  useEffect(() => {
    setResolvedSrc(resolveAssetUrl(src || fallback))
  }, [fallback, src])

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (resolvedSrc !== resolvedFallback) setResolvedSrc(resolvedFallback)
      }}
    />
  )
}

export default SafeImage
