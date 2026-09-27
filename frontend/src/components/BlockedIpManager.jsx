import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const BlockedIpManager = () => {
  const [blockedIps, setBlockedIps] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [pendingIp, setPendingIp] = useState('')
  const token = localStorage.getItem('adminToken')

  const loadBlockedIps = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/blocked-ips`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBlockedIps(response.data)
      setError('')
    } catch {
      setError('Unable to load blocked addresses. Check the database connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { loadBlockedIps() }, [loadBlockedIps])

  const unblockIp = async (ip) => {
    setPendingIp(ip)
    try {
      await axios.delete(`${API_URL}/auth/blocked-ips/${encodeURIComponent(ip)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBlockedIps(current => current.filter(record => record.ip !== ip))
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not unblock this address. Please try again.')
    } finally {
      setPendingIp('')
    }
  }

  return (
    <section className="dashboard__card blocked-ip-panel" aria-labelledby="blocked-ip-title">
      <div className="blocked-ip-panel__header">
        <div>
          <h3 id="blocked-ip-title">Blocked sign-in addresses</h3>
          <p>Review networks blocked after repeated incorrect admin passwords. Shared networks may include several people.</p>
        </div>
        <button type="button" className="button button-outline" onClick={loadBlockedIps} disabled={loading}>Refresh</button>
      </div>
      {error && <p className="dashboard-notice is-error" role="alert">{error}</p>}
      {loading ? <p>Loading blocked addresses…</p> : blockedIps.length === 0 ? (
        <p className="dashboard-empty-state">No blocked addresses right now.</p>
      ) : (
        <div className="blocked-ip-list">
          {blockedIps.map(record => (
            <div className="blocked-ip-row" key={record.ip}>
              <div>
                <strong>{record.ip}</strong>
                <span>{record.failedAttempts} failed attempts · blocked {record.blockedAt ? new Date(record.blockedAt).toLocaleString() : 'recently'}</span>
              </div>
              <button type="button" className="button" disabled={pendingIp === record.ip} onClick={() => unblockIp(record.ip)}>
                {pendingIp === record.ip ? 'Removing…' : 'Unblock'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default BlockedIpManager
