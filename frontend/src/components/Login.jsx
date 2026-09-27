import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accessState, setAccessState] = useState('checking')
  const [checkAgain, setCheckAgain] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    axios.get(`${API_URL}/auth/status`, { timeout: 10000 })
      .then(response => { if (active) setAccessState(response.data.blocked ? 'blocked' : 'ready') })
      .catch(() => { if (active) setAccessState('unavailable') })
    return () => { active = false }
  }, [checkAgain])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password }, { timeout: 15000 })
      localStorage.setItem('adminToken', response.data.token)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to sign in. Check your details and try again.')
      if (requestError.response?.data?.blocked) setAccessState('blocked')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <Link to="/" className="login-back-link"><i className="bx bx-arrow-back" aria-hidden="true" /> Back to portfolio</Link>
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-mark" aria-hidden="true"><i className="bx bx-shield-quarter" /></div>
        <p className="login-eyebrow">Private workspace</p>
        <h1 id="login-title">{accessState === 'blocked' ? 'Sign-in unavailable' : accessState === 'unavailable' ? 'Security check unavailable' : 'Welcome back'}</h1>
        <p className="login-description">
          {accessState === 'blocked'
            ? 'This network is blocked after repeated incorrect sign-in attempts. Ask the site owner to remove it from the admin block list.'
            : accessState === 'unavailable'
              ? 'We could not verify this network right now. Check that the server and database are available, then try again.'
              : 'Sign in to manage your portfolio and Knowledge Hub.'}
        </p>

        {error && <div className="login-error" role="alert">{error}</div>}

        {accessState === 'checking' && <p className="login-access-status" role="status">Checking sign-in access…</p>}
        {accessState === 'unavailable' && <button type="button" className="button login-submit" onClick={() => { setAccessState('checking'); setCheckAgain(value => value + 1) }}>Try again</button>}

        {accessState === 'ready' && <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="login-password-field">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="button" className="login-password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              <i className={showPassword ? 'bx bx-hide' : 'bx bx-show'} aria-hidden="true" />
            </button>
          </div>

          <button className="button login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            {!isSubmitting && <i className="bx bx-right-arrow-alt" aria-hidden="true" />}
          </button>
        </form>}
        <p className="login-footnote"><i className="bx bx-lock-alt" aria-hidden="true" /> Authorized administrators only</p>
      </section>
    </main>
  )
}

export default Login
