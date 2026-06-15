import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

export default function Profile() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', targetRole: '', university: ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        targetRole: user.targetRole || '',
        university: user.university || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      const { data } = await API.put('/auth/profile', form)
      login({ ...user, ...data })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-5 border-b border-gray-800">
          <div className="text-xl font-bold text-white">Job<span className="text-violet-500">Tracker</span></div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          <div className="text-xs text-gray-600 uppercase tracking-wider px-3 py-2">Main</div>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors">
            <span>💼</span> Applications
          </Link>
          <Link to="/analyzer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors">
            <span>🤖</span> AI Analyzer
          </Link>
          <div className="text-xs text-gray-600 uppercase tracking-wider px-3 py-2 mt-2">Account</div>
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 text-violet-400 font-medium text-sm">
            <span>👤</span> Profile
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 text-sm transition-colors">
            <span>🚪</span> Logout
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.targetRole || 'Student'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your account details</p>
        </div>

        <div className="max-w-2xl">

          {/* Avatar card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-lg font-semibold text-white">{user?.name}</div>
              <div className="text-sm text-gray-400">{user?.email}</div>
              <div className="flex gap-2 mt-2">
                {user?.university && (
                  <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded-full">
                    {user.university}
                  </span>
                )}
                {user?.targetRole && (
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
                    {user.targetRole}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-5">Edit details</h3>

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Full name</label>
                  <input
                    name="name" value={form.name} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Email</label>
                  <input
                    name="email" value={form.email} disabled
                    className="w-full bg-gray-800/50 border border-gray-700 text-gray-500 rounded-lg px-3 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">University</label>
                  <input
                    name="university" value={form.university} onChange={handleChange}
                    placeholder="e.g. SLIIT"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Target role</label>
                  <input
                    name="targetRole" value={form.targetRole} onChange={handleChange}
                    placeholder="e.g. Data Scientist"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  )
}