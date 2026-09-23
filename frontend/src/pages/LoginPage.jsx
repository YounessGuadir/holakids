import { useState } from 'react'
import { LockKeyhole, LogIn, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { readApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

function LoginPage() {
  const { login } = useAuth()
  const { t } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault(); setSubmitting(true); setError('')
    try {
      const user = await login(form)
      navigate(user.role === 'ADMIN' ? '/admin' : location.state?.from?.pathname || '/account', { replace: true })
    } catch (requestError) {
      setError(readApiError(requestError, 'Identifiants incorrects.'))
    } finally { setSubmitting(false) }
  }

  return (
    <div className="auth-page"><section className="auth-card"><div className="auth-icon"><LogIn /></div><h1>{t('loginTitle')}</h1><p>{t('loginIntro')}</p>
      {error && <div className="form-alert" role="alert">{error}</div>}
      <form onSubmit={submit} className="auth-form">
        <label><span>{t('email')}</span><div><Mail size={18} /><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="admin@holakids.ma" /></div></label>
        <label><span>{t('password')}</span><div><LockKeyhole size={18} /><input type="password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div></label>
        <button className="button button-primary auth-submit" disabled={submitting}>{submitting ? t('loading') : t('login')}</button>
      </form>
      <p className="auth-switch">{t('noAccount')} <Link to="/register">{t('createAccount')}</Link></p>
    </section></div>
  )
}

export default LoginPage
