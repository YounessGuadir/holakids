import { LogOut, MessageCircle, ShieldCheck, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { createWhatsAppLink } from '../utils/whatsapp'

function AccountPage() {
  const { user, isAdmin, logout } = useAuth()
  const { locale, t } = useLocale()
  const navigate = useNavigate()
  function signOut() { logout(); navigate('/') }
  return (
    <div className="account-page site-container"><section className="account-card"><div className="account-avatar">{isAdmin ? <ShieldCheck /> : <UserRound />}</div><p>{t('welcome')}</p><h1>{user.fullName}</h1><dl><div><dt>{t('email')}</dt><dd>{user.email}</dd></div><div><dt>{t('role')}</dt><dd>{isAdmin ? t('adminRole') : t('clientRole')}</dd></div></dl><p>{t('profileText')}</p><div className="account-actions">{isAdmin && <Link className="button button-primary" to="/admin">{t('admin')}</Link>}<a className="button whatsapp-button" href={createWhatsAppLink(null, locale)} target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a><button className="button button-light" onClick={signOut}><LogOut size={18} />{t('logout')}</button></div></section></div>
  )
}

export default AccountPage
