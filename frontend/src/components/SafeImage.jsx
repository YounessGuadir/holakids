import { useEffect, useState } from 'react'

const FALLBACK_IMAGE = '/images/products/placeholder-toy.svg'

function SafeImage({ src, alt = '', fallback = FALLBACK_IMAGE, ...props }) {
  const [resolvedSrc, setResolvedSrc] = useState(src || fallback)

  useEffect(() => { setResolvedSrc(src || fallback) }, [fallback, src])

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (resolvedSrc !== fallback) setResolvedSrc(fallback)
      }}
    />
  )
}

export default SafeImage
