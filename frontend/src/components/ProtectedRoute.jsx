import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ adminOnly = false, children }) {
  const { authenticated, checking, isAdmin } = useAuth()
  const location = useLocation()

  if (checking) return <div className="page-loader">Chargement…</div>
  if (!authenticated) return <Navigate to="/login" replace state={{ from: location }} />
  if (adminOnly && !isAdmin) return <Navigate to="/account" replace />
  return children
}

export default ProtectedRoute
