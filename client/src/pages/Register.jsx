import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', targetRole: '', university: '' })
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
      const { data } = await API.post('/auth/register', form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* Left — Register form */}
      <div style={{
        width: '45%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '48px 40px',
        background: '#0f1117', flexShrink: 0
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed', marginBottom: 6 }}>JobTracker</div>
            <p style={{ color: '#6b7280', fontSize: 13 }}>Create your free account and start tracking</p>
          </div>

          <div style={{ background: '#1a1d27', border: '1px solid #2d3149', borderRadius: 18, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Create account</h2>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Free forever · No credit card needed</p>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13, padding: '12px 16px', borderRadius: 10, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Full name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Dihini Nihinsa" required
                  style={{ width: '100%', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="dg@gmail.com" required
                  style={{ width: '100%', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
                  style={{ width: '100%', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>University</label>
                  <input
                    type="text" name="university" value={form.university} onChange={handleChange}
                    placeholder="SLIIT"
                    style={{ width: '100%', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Target role</label>
                  <input
                    type="text" name="targetRole" value={form.targetRole} onChange={handleChange}
                    placeholder="Data Scientist"
                    style={{ width: '100%', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', background: '#7c3aed', color: '#ffffff', fontWeight: 700,
                padding: 12, borderRadius: 10, fontSize: 14, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1
              }}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, marginTop: 20 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '📄', text: 'Upload your CV as PDF' },
              { icon: '🤖', text: 'AI analyzes against job description' },
              { icon: '📊', text: 'Get match score and missing keywords' },
              { icon: '💡', text: 'Receive personalized suggestions' },
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
        {/* Gradient fallback */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
        }} />
        {/* Photo */}
        <img
          src="/register-bg.png"
          alt="Person working"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center'
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Bottom overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)'
        }} />
        {/* Info card */}
        <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
          <div style={{
            background: 'rgba(17,24,39,0.80)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16,
            padding: 24, maxWidth: 360
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
              Get AI feedback on your resume instantly.
            </div>
            <p style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>
              Upload your CV, paste a job description, and get a match score with actionable improvement suggestions powered by AI.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Upload CV as PDF', 'AI match score instantly', 'Missing keywords found', 'Personalized suggestions'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#d1d5db' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0 }}>✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}