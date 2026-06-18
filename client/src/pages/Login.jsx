import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* Left — Login form */}
      <div style={{
        width: '45%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '48px 40px',
        background: '#0f1117', flexShrink: 0, position: 'relative'
      }}>
        {/* Home Button - Top Left */}
        <Link
          to="/"
          style={{
            position: 'absolute',
            top: 32,
            left: 40,
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: 15,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 10
          }}
        >
          ← Home
        </Link>

        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed', marginBottom: 6 }}>JobTracker</div>
            <p style={{ color: '#6b7280', fontSize: 13 }}>Welcome back Sign in to continue</p>
          </div>

          <div style={{ background: '#1a1d27', border: '1px solid #2d3149', borderRadius: 18, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Welcome back</h2>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Sign in to your account</p>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13, padding: '12px 16px', borderRadius: 10, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="youremail@.com" required
                  style={{ width: '100%', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
                  style={{ width: '100%', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', background: '#7c3aed', color: '#ffffff', fontWeight: 700,
                padding: '12px', borderRadius: 10, fontSize: 14, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1
              }}>
                {loading ? 'Signing in...' : 'Login to dashboard'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, marginTop: 20 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Register here</Link>
            </p>
            <div style={{ textAlign: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #2d3149' }}>
              <a href="/admin-login" style={{ color: 'rgba(251,191,36,0.6)', fontSize: 12, textDecoration: 'none' }}>🛡️ Admin portal</a>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '📊', text: 'Track all your applications in one place' },
              { icon: '🤖', text: 'AI-powered resume match scores' },
              { icon: '🔔', text: 'Never miss a deadline again' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#6b7280' }}>
                <span>{icon}</span>{text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Full image */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 40%, #4c1d95 70%, #1e1b4b 100%)'
        }} />
        <img
          src="/login-bg.png"
          alt="Team collaborating"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center'
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)'
        }} />
        <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
          <div style={{
            background: 'rgba(17,24,39,0.80)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16,
            padding: 24, maxWidth: 380
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
              Join a community of job seekers
            </div>
            <p style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>
              Thousands of students use JobTracker to organize their search and land their dream roles faster.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex' }}>
                {['DN', 'AK', 'SP', 'MR'].map((init, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    border: '2px solid #111827',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#ffffff',
                    marginLeft: i > 0 ? -10 : 0,
                    background: ['#7c3aed', '#2563eb', '#16a34a', '#dc2626'][i]
                  }}>{init}</div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>500+ users tracking jobs</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}