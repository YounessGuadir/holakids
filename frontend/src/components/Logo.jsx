import { Link } from 'react-router-dom'

function Logo({ compact = false }) {
  return (
    <Link className={`site-logo ${compact ? 'compact' : ''}`} to="/" aria-label="Accueil HOLAKIDS">
      <span className="logo-symbol" aria-hidden="true">
        <span>H</span>
        <i />
      </span>
      <span className="logo-word">
        HOLA<span>KIDS</span>
      </span>
    </Link>
  )
}

export default Logo

