import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'admin@jobtracker.com'
const ADMIN_PASSWORD = 'Admin@2026'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
        login({
          _id: 'admin-001',
          name: 'Admin',
          email: ADMIN_EMAIL,
          targetRole: 'Administrator',
          university: 'JobTracker',
          isAdmin: true,
          isBanned: false,
          token: 'admin-hardcoded-token'
        })
        navigate('/admin')
      } else {
        setError('Invalid admin credentials')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Restricted access — authorized personnel only</p>
        </div>

        <div className="bg-gray-900 border border-amber-500/20 rounded-2xl p-8">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
            <span className="text-amber-400 text-sm">⚠️</span>
            <span className="text-amber-400 text-xs">This portal is for administrators only</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">Admin email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@jobtracker.com"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">Admin password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-950 font-bold py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              {loading ? 'Verifying...' : '🛡️ Login as Admin'}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/login" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              ← Back to user login
            </a>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-700 text-xs">
            Admin credentials are hardcoded for security
          </p>
        </div>
      </div>
    </div>
  )
}