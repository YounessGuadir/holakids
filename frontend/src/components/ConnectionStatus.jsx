import { useEffect, useState } from 'react'
import { getHealth } from '../api/healthApi'

const stateContent = {
  checking: {
    label: 'Vérification de la connexion…',
    detail: 'React contacte l’API HOLAKIDS.',
  },
  connected: {
    label: 'Backend connecté.',
    detail: 'Spring Boot communique correctement avec SQL Server.',
  },
  unavailable: {
    label: 'Backend indisponible.',
    detail: 'Vérifiez que les trois conteneurs sont démarrés.',
  },
}

function ConnectionStatus() {
  const [connectionState, setConnectionState] = useState('checking')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function checkConnection() {
      setConnectionState('checking')

      try {
        const health = await getHealth(controller.signal)
        setConnectionState(health.status === 'UP' ? 'connected' : 'unavailable')
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          setConnectionState('unavailable')
        }
      }
    }

    checkConnection()

    return () => controller.abort()
  }, [attempt])

  const content = stateContent[connectionState]
  const isConnected = connectionState === 'connected'
  const isChecking = connectionState === 'checking'

  return (
    <section
      id="connexion"
      aria-live="polite"
      className="connection-card"
    >
      <div className="flex items-start gap-4">
        <span
          className={`status-icon ${connectionState}`}
          aria-hidden="true"
        >
          {isChecking ? '…' : isConnected ? '✓' : '!'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold text-ink">{content.label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{content.detail}</p>
        </div>
      </div>

      <div className="architecture-flow" aria-label="Architecture technique">
        <span className="architecture-node active">React</span>
        <span className="architecture-arrow" aria-hidden="true">→</span>
        <span className={`architecture-node ${isConnected ? 'active' : ''}`}>
          Spring Boot
        </span>
        <span className="architecture-arrow" aria-hidden="true">→</span>
        <span className={`architecture-node ${isConnected ? 'active' : ''}`}>
          SQL Server
        </span>
      </div>

      {connectionState === 'unavailable' && (
        <button
          type="button"
          className="retry-button"
          onClick={() => setAttempt((current) => current + 1)}
        >
          Réessayer
        </button>
      )}
    </section>
  )
}

export default ConnectionStatus

