import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { API_URL } from '../config/api'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [challengeId, setChallengeId] = useState(() => sessionStorage.getItem('adminLoginChallenge') || '')
  const [pinLocked, setPinLocked] = useState(() => sessionStorage.getItem('adminLoginPinLocked') === 'true')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accessState, setAccessState] = useState('checking')
  const [checkAgain, setCheckAgain] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    axios.get(`${API_URL}/auth/status`, { timeout: 10000 })
      .then(() => { if (active) setAccessState('ready') })
      .catch(() => { if (active) setAccessState('unavailable') })
    return () => { active = false }
  }, [checkAgain])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setIsSubmitting(true)
    try {
      if (!challengeId) {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password }, { timeout: 15000 })
        const nextChallengeId = response.data?.challengeId || response.data?.challenge_id
        if (!nextChallengeId) throw new Error('The PIN email was sent, but the server did not return a verification session. Please start sign-in again.')
        sessionStorage.setItem('adminLoginChallenge', nextChallengeId)
        setChallengeId(nextChallengeId)
        setPassword('')
        setNotice('A four-digit verification PIN was sent to your admin email. It expires in 5 minutes.')
        return
      }

      const response = await axios.post(`${API_URL}/auth/verify-pin`, { challengeId, pin }, { timeout: 15000 })
      sessionStorage.removeItem('adminLoginChallenge')
      sessionStorage.removeItem('adminLoginPinLocked')
      localStorage.setItem('adminToken', response.data.token)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to sign in. Check your details and try again.')
      const responseError = requestError.response?.data
      if (responseError?.code === 'PIN_ATTEMPTS_EXCEEDED' || /too many incorrect pins/i.test(responseError?.error || '')) {
        sessionStorage.removeItem('adminLoginChallenge')
        sessionStorage.setItem('adminLoginPinLocked', 'true')
        setPinLocked(true)
        setPin('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const restartSignIn = () => {
    sessionStorage.removeItem('adminLoginChallenge')
    sessionStorage.removeItem('adminLoginPinLocked')
    setChallengeId('')
    setPinLocked(false)
    setPin('')
    setNotice('')
    setError('')
  }

  return (
    <main id="main-content" className="login-page">
      <Link to="/" className="login-back-link"><i className="bx bx-arrow-back" aria-hidden="true" /> Back to portfolio</Link>
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-mark" aria-hidden="true"><i className="bx bx-shield-quarter" /></div>
        <p className="login-eyebrow">Private workspace</p>
        <h1 id="login-title">{pinLocked ? 'Sign-in attempt locked' : accessState === 'unavailable' ? 'Security check unavailable' : challengeId ? 'Verify it’s you' : 'Welcome back'}</h1>
        <p className="login-description">
          {pinLocked
              ? 'This PIN can no longer be used. Start again with your password to request a new PIN.'
              : accessState === 'unavailable'
              ? 'We could not verify this network right now. Check that the server and database are available, then try again.'
              : challengeId
                ? 'Enter the four-digit PIN sent to your administrator email to finish signing in.'
                : 'Sign in to manage your portfolio and Knowledge Hub.'}
        </p>

        {challengeId && !pinLocked && <div className="login-verification-state" role="status">
          <i className="bx bx-envelope" aria-hidden="true" />
          <span><strong>PIN sent</strong><br />Check your administrator email, then enter the four-digit code below.</span>
        </div>}

        {error && <div className="login-error" role="alert">{error}</div>}
        {notice && !challengeId && <p className="login-pin-notice" role="status">{notice}</p>}

        {accessState === 'checking' && <p className="login-access-status" role="status">Checking sign-in access…</p>}
        {pinLocked && <button type="button" className="button login-submit" onClick={restartSignIn}>Start again with password</button>}
        {!pinLocked && accessState === 'unavailable' && <button type="button" className="button login-submit" onClick={() => { setAccessState('checking'); setCheckAgain(value => value + 1) }}>Try again</button>}

        {!pinLocked && (accessState === 'ready' || challengeId) && <form onSubmit={handleLogin} className="login-form">
          {!challengeId ? <>
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
          </> : <>
            <label htmlFor="admin-pin">Four-digit PIN</label>
            <input
              id="admin-pin"
              type="text"
              name="pin"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{4}"
              maxLength={4}
              placeholder="Enter the PIN from your email"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              required
            />
            <button type="button" className="login-step-back" onClick={restartSignIn}>Back to password</button>
          </>}

          <button className="button login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (challengeId ? 'Verifying…' : 'Sending PIN…') : (challengeId ? 'Verify PIN' : 'Send PIN')}
            {!isSubmitting && <i className="bx bx-right-arrow-alt" aria-hidden="true" />}
          </button>
        </form>}
        <p className="login-footnote"><i className="bx bx-lock-alt" aria-hidden="true" /> Authorized administrators only</p>
      </section>
    </main>
  )
}

export default Login
