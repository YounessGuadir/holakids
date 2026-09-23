import { useState } from 'react'
import { LockKeyhole, Mail, UserPlus, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { readApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

function RegisterPage() {
  const { register } = useAuth()
  const { t } = useLocale()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault(); setSubmitting(true); setError('')
    try { await register(form); navigate('/account', { replace: true }) }
    catch (requestError) { setError(readApiError(requestError)) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="auth-page"><section className="auth-card"><div className="auth-icon"><UserPlus /></div><h1>{t('registerTitle')}</h1><p>{t('loginIntro')}</p>
      {error && <div className="form-alert" role="alert">{error}</div>}
      <form onSubmit={submit} className="auth-form">
        <label><span>{t('fullName')}</span><div><UserRound size={18} /><input required minLength="2" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></div></label>
        <label><span>{t('email')}</span><div><Mail size={18} /><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div></label>
        <label><span>{t('password')}</span><div><LockKeyhole size={18} /><input type="password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div></label>
        <button className="button button-primary auth-submit" disabled={submitting}>{submitting ? t('loading') : t('createAccount')}</button>
      </form>
      <p className="auth-switch">{t('alreadyAccount')} <Link to="/login">{t('login')}</Link></p>
    </section></div>
  )
}

export default RegisterPage
