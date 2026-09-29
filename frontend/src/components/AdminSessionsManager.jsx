import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { API_URL } from '../config/api'

const AdminSessionsManager = () => {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [pendingSession, setPendingSession] = useState('')
  const token = localStorage.getItem('adminToken')
  const navigate = useNavigate()

  const loadSessions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSessions(response.data)
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load signed-in devices.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { loadSessions() }, [loadSessions])

  const signOutDevice = async (session) => {
    setPendingSession(session.id)
    try {
      await axios.delete(`${API_URL}/auth/sessions/${encodeURIComponent(session.id)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (session.isCurrent) {
        localStorage.removeItem('adminToken')
        navigate('/login')
        return
      }
      setSessions(current => current.filter(item => item.id !== session.id))
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not sign out this device.')
    } finally {
      setPendingSession('')
    }
  }

  return (
    <section className="dashboard__card session-panel" aria-labelledby="session-manager-title">
      <div className="session-panel__header">
        <div>
          <h3 id="session-manager-title">Signed-in devices</h3>
          <p>Review administrator sessions and sign out any device. Revoked sessions lose access immediately.</p>
        </div>
        <button type="button" className="button button-outline" onClick={loadSessions} disabled={loading}>Refresh</button>
      </div>
      {error && <p className="dashboard-notice is-error" role="alert">{error}</p>}
      {loading ? <p>Loading signed-in devices…</p> : sessions.length === 0 ? (
        <p className="dashboard-empty-state">No active sessions found.</p>
      ) : (
        <div className="session-list">
          {sessions.map(session => (
            <div className="session-row" key={session.id}>
              <div>
                <strong>{session.device}{session.isCurrent ? ' · This device' : ''}</strong>
                <span>IP {session.ip} · Signed in {new Date(session.createdAt).toLocaleString()}</span>
                <span>Last active {new Date(session.lastActiveAt).toLocaleString()}</span>
              </div>
              <button
                type="button"
                className="button"
                disabled={pendingSession === session.id}
                onClick={() => signOutDevice(session)}
              >
                {pendingSession === session.id ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminSessionsManager
