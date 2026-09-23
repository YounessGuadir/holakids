import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../i18n/translations'

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => window.localStorage.getItem('holakids_locale') || 'fr')

  useEffect(() => {
    window.localStorage.setItem('holakids_locale', locale)
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const value = useMemo(() => ({
    locale,
    isArabic: locale === 'ar',
    setLocale,
    toggleLocale: () => setLocale((current) => (current === 'fr' ? 'ar' : 'fr')),
    t: (key) => translations[locale][key] || translations.fr[key] || key,
  }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale doit être utilisé dans LocaleProvider')
  return context
}
