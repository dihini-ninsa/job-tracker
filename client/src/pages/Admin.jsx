import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import {
  Users, LayoutDashboard, Briefcase, Trophy,
  Calendar, ShieldOff, Shield, Trash2, TrendingUp, LogOut
} from 'lucide-react'

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [viewingUser, setViewingUser] = useState(null)
  const [userApps, setUserApps] = useState([])
  const [appsLoading, setAppsLoading] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const viewUserApps = async (user) => {
  setViewingUser(user)
  setAppsLoading(true)
  try {
    const { data } = await API.get(`/admin/users/${user._id}/applications`)
    setUserApps(data)
  } catch {
    toast.error('Failed to load applications')
  } finally {
    setAppsLoading(false)
  }
}

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name} and all their data?`)) return
    try {
      await API.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
      toast.success(`${name} deleted`)
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const handleBan = async (id, name, isBanned) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/ban`)
      setUsers(users.map(u => u._id === id ? { ...u, isBanned: data.isBanned } : u))
      toast.success(`${name} ${data.isBanned ? 'banned' : 'unbanned'}`)
    } catch {
      toast.error('Failed to update user')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin-login')
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const statCards = stats ? [
    { label: 'Total users', value: stats.totalUsers, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Total applications', value: stats.totalApplications, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Interviews', value: stats.totalInterviews, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Offers', value: stats.totalOffers, icon: Trophy, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'New this month', value: stats.newUsersThisMonth, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Banned users', value: stats.bannedUsers, icon: ShieldOff, color: 'text-red-400', bg: 'bg-red-500/10' },
  ] : []

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Admin Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-amber-500/10 flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-gray-800">
          <div className="text-xl font-bold text-white">
            Job<span className="text-amber-500">Tracker</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield size={11} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <div className="text-xs text-gray-600 uppercase tracking-wider px-3 py-2">Management</div>
          <button
            onClick={() => setTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              tab === 'overview'
                ? 'bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}>
            <LayoutDashboard size={16} />
            Overview
          </button>
          <button
            onClick={() => setTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              tab === 'users'
                ? 'bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}>
            <Users size={16} />
            Users
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 text-sm transition-all mt-4">
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-gray-950 text-xs font-bold">
              A
            </div>
            <div>
              <div className="text-sm font-medium text-white">Admin</div>
              <div className="text-xs text-amber-400">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-amber-400" />
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </div>
            <p className="text-gray-400 text-sm">Manage users and monitor platform activity</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Shield size={12} />
            Administrator
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading admin data...</div>
        ) : (
          <>
            {tab === 'overview' && (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon size={18} className={color} />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Recent registrations</h3>
                  <div className="space-y-1">
                    {users.slice(0, 8).map(u => (
                      <div key={u._id} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">
                            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{u.appCount} apps</span>
                          {u.isBanned && (
                            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Banned</span>
                          )}
                          <span className="text-xs text-gray-600">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'users' && (
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full max-w-sm bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
                  />
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">User</th>
                        <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">University</th>
                        <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Target role</th>
                        <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Apps</th>
                        <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Status</th>
                        <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Joined</th>
                        <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-12 text-gray-600 text-sm">No users found</td></tr>
                      ) : (
                        filtered.map(u => (
                          <tr key={u._id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">
                                  {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{u.name}</div>
                                  <div className="text-xs text-gray-500">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">{u.university || '—'}</td>
                            <td className="px-6 py-4 text-sm text-gray-400">{u.targetRole || '—'}</td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-white">{u.appCount}</span>
                            </td>
                            <td className="px-6 py-4">
                              {u.isBanned ? (
                                <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">Banned</span>
                              ) : (
                                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">Active</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleBan(u._id, u.name, u.isBanned)}
                                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                                    u.isBanned
                                      ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                  }`}>
                                  {u.isBanned ? <Shield size={12} /> : <ShieldOff size={12} />}
                                  {u.isBanned ? 'Unban' : 'Ban'}
                                </button>
                                <button
                                  onClick={() => viewUserApps(u)}
                                  className="flex items-center gap-1.5 text-xs bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 px-3 py-1.5 rounded-lg transition-colors">
                                  👁️ View apps
                                </button>
                                <button
                                  onClick={() => handleDelete(u._id, u.name)}
                                  className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      {viewingUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h3 className="text-base font-semibold text-white">{viewingUser.name}'s Applications</h3>
                <p className="text-xs text-gray-500 mt-0.5">{viewingUser.email}</p>
              </div>
              <button onClick={() => setViewingUser(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {appsLoading ? (
                <div className="text-center py-8 text-gray-600 text-sm">Loading...</div>
              ) : userApps.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-sm">No applications found</div>
              ) : (
                <div className="space-y-2">
                  {userApps.map(app => (
                    <div key={app._id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">{app.company}</div>
                        <div className="text-xs text-gray-500">{app.role} · {new Date(app.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        app.status === 'Applied' ? 'bg-violet-500/10 text-violet-400' :
                        app.status === 'Interview' ? 'bg-blue-500/10 text-blue-400' :
                        app.status === 'Offer' ? 'bg-green-500/10 text-green-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}