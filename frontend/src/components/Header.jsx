import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown, Globe2, Instagram, LogIn, MapPin, Menu, MessageCircle,
  Phone, Search, ShieldCheck, UserRound, X,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useLocale } from '../context/LocaleContext'
import { normalizeSearch } from '../utils/format'
import { localizedStore } from '../utils/localize'
import { createWhatsAppLink } from '../utils/whatsapp'
import Logo from './Logo'
import SafeImage from './SafeImage'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { products } = useCatalog()
  const { authenticated, isAdmin } = useAuth()
  const { locale, t, toggleLocale } = useLocale()
  const store = localizedStore(locale)
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setSearchValue(new URLSearchParams(location.search).get('search') || '')
    setMobileOpen(false)
  }, [location.pathname, location.search])

  const suggestions = useMemo(() => {
    const query = normalizeSearch(searchValue)
    if (query.length < 2) return []
    return products
      .filter((product) => normalizeSearch(`${product.name} ${product.brand} ${product.categoryLabel}`).includes(query))
      .slice(0, 4)
  }, [products, searchValue])

  function submitSearch(event) {
    event.preventDefault()
    const query = searchValue.trim()
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
    setSearchFocused(false)
  }

  const searchForm = (mobile = false) => (
    <form className={`header-search ${mobile ? 'mobile' : ''}`} onSubmit={submitSearch} role="search">
      <Search size={21} aria-hidden="true" />
      <input
        type="search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('search')}
      />
      <button type="submit">{t('search')}</button>
      {searchFocused && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((product) => (
            <button key={product.id} type="button" onMouseDown={() => navigate(`/products/${product.slug}`)}>
              <SafeImage src={product.image} alt="" />
              <span><strong>{product.shortName}</strong><small>{product.brand}</small></span>
            </button>
          ))}
          <button className="all-results" type="submit">{t('allResults')}</button>
        </div>
      )}
    </form>
  )

  const accountLink = isAdmin ? '/admin' : authenticated ? '/account' : '/login'

  return (
    <header className="site-header">
      <div className="announcement-bar">
        <div className="site-container announcement-inner">
          <span><MapPin size={15} />{store.address}</span>
          <span className="announcement-highlight">{t('stockWhatsApp')}</span>
          <a href={`tel:${store.phoneInternational}`}><Phone size={15} />{store.phoneDisplay}</a>
        </div>
      </div>

      <div className="site-container header-main">
        <button type="button" className="mobile-menu-button" aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu /></button>
        <Logo />
        <div className="desktop-search">{searchForm()}</div>
        <div className="header-actions">
          <button className="header-action language-action" type="button" onClick={toggleLocale}>
            <Globe2 size={21} /><span>{t('language')}</span>
          </button>
          <Link className="header-action account-action" to={accountLink}>
            {isAdmin ? <ShieldCheck size={21} /> : authenticated ? <UserRound size={21} /> : <LogIn size={21} />}
            <span>{isAdmin ? t('admin') : authenticated ? t('account') : t('login')}</span>
          </Link>
          <a className="header-action whatsapp" href={createWhatsAppLink(null, locale)} target="_blank" rel="noreferrer">
            <MessageCircle size={22} /><span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="site-container mobile-search-wrap">{searchForm(true)}</div>

      <nav className="desktop-nav" aria-label="Navigation">
        <div className="site-container desktop-nav-inner">
          <NavLink to="/products" className="all-toys-link"><Menu size={18} />{t('allToys')}<ChevronDown size={16} /></NavLink>
          <NavLink to="/">{t('home')}</NavLink>
          <Link to="/products?category=bebe">{t('baby')}</Link>
          <Link to="/products?category=poupees">{t('dolls')}</Link>
          <Link to="/products?category=vehicules">{t('vehicles')}</Link>
          <Link to="/products?category=construction">{t('construction')}</Link>
          <Link to="/products?category=outdoor">{t('outdoor')}</Link>
          <Link to="/products?promotion=true" className="promotion-link">{t('promotions')}</Link>
          <NavLink to="/contact">{t('contact')}</NavLink>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="drawer-backdrop" aria-label="Fermer" onClick={() => setMobileOpen(false)} />
          <div className="drawer-panel">
            <div className="drawer-header"><Logo compact /><button type="button" aria-label="Fermer" onClick={() => setMobileOpen(false)}><X /></button></div>
            <nav>
              <Link to="/">{t('home')}</Link><Link to="/products">{t('allToys')}</Link>
              <Link to="/products?category=bebe">{t('baby')}</Link><Link to="/products?category=poupees">{t('dolls')}</Link>
              <Link to="/products?category=vehicules">{t('vehicles')}</Link><Link to="/products?category=construction">{t('construction')}</Link>
              <Link to="/products?category=outdoor">{t('outdoor')}</Link><Link className="drawer-promo" to="/products?promotion=true">{t('promotions')}</Link>
              <Link to="/contact">{t('contact')}</Link><Link to={accountLink}>{isAdmin ? t('admin') : authenticated ? t('account') : t('login')}</Link>
              <button className="drawer-language" type="button" onClick={toggleLocale}><Globe2 size={18} />{t('language')}</button>
            </nav>
            <a className="drawer-whatsapp" href={createWhatsAppLink(null, locale)} target="_blank" rel="noreferrer"><MessageCircle size={20} />{t('whatsappWrite')}</a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
