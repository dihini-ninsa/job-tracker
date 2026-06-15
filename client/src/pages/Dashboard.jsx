import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import { motion } from 'framer-motion'
import { SkeletonCard, SkeletonRow } from '../components/Skeleton'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import Layout from '../components/Layout'

const STATUS_COLORS = {
  Applied: '#7c3aed',
  Interview: '#2563eb',
  Offer: '#16a34a',
  Rejected: '#dc2626'
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications')
      setApplications(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const counts = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  }

  const pieData = [
    { name: 'Applied', value: counts.applied },
    { name: 'Interview', value: counts.interview },
    { name: 'Offer', value: counts.offer },
    { name: 'Rejected', value: counts.rejected },
  ].filter(d => d.value > 0)

  const getWeeklyData = () => {
    const weeks = {}
    applications.forEach(app => {
      const date = new Date(app.createdAt)
      const week = `W${Math.ceil(date.getDate() / 7)} ${date.toLocaleString('default', { month: 'short' })}`
      weeks[week] = (weeks[week] || 0) + 1
    })
    return Object.entries(weeks).slice(-6).map(([week, count]) => ({ week, count }))
  }

  const weeklyData = getWeeklyData()
  const recent = applications.slice(0, 5)

  const statusColor = {
    Applied: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
    Interview: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Offer: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }

  const statusDot = {
    Applied: 'bg-violet-400',
    Interview: 'bg-blue-400',
    Offer: 'bg-green-400',
    Rejected: 'bg-red-400',
  }

  const statCards = [
    { label: 'Total Applied', value: counts.total, color: 'text-violet-400', bg: 'bg-violet-500/10', delta: 'All applications' },
    { label: 'Interviews', value: counts.interview, color: 'text-blue-400', bg: 'bg-blue-500/10', delta: 'Scheduled' },
    { label: 'Offers', value: counts.offer, color: 'text-green-400', bg: 'bg-green-500/10', delta: 'Received' },
    { label: 'Rejected', value: counts.rejected, color: 'text-red-400', bg: 'bg-red-500/10', delta: `${counts.total > 0 ? Math.round((counts.rejected / counts.total) * 100) : 0}% rate` },
  ]

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's your job search overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          statCards.map(({ label, value, color, bg, delta }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}></div>
              </div>
              <div className={`text-3xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</div>
              <div className="text-xs text-gray-600 mt-1">{delta}</div>
            </motion.div>
          ))
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Status breakdown</h3>
          {counts.total === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">No applications yet</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {pieData.map(({ name, value }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[name] }}></div>
                    <span className="text-xs text-gray-400">{name}</span>
                    <span className="text-xs font-medium text-white ml-auto">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Weekly activity</h3>
          {weeklyData.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">No activity yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#e5e7eb' }}
                  cursor={{ fill: 'rgba(124,58,237,0.1)' }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Quick actions + Recent */}
      <div className="grid grid-cols-2 gap-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Quick actions</h3>
          <div className="space-y-2.5">
            {[
              { to: '/applications', icon: '➕', title: 'Add new application', sub: 'Track a new job', color: 'bg-violet-500/10' },
              { to: '/analyzer', icon: '🤖', title: 'Analyze my resume', sub: 'Get AI match score', color: 'bg-blue-500/10' },
              { to: '/profile', icon: '👤', title: 'Update profile', sub: 'Edit your details', color: 'bg-green-500/10' },
            ].map(({ to, icon, title, sub, color }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group">
                <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-sm flex-shrink-0`}>
                  {icon}
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{title}</div>
                  <div className="text-xs text-gray-500">{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent applications</h3>
            <Link to="/applications" className="text-xs text-violet-400 hover:text-violet-300">
              View all →
            </Link>
          </div>
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
          ) : recent.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 text-sm mb-3">No applications yet</div>
              <Link to="/applications"
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Add your first
              </Link>
            </div>
          ) : (
            recent.map(app => (
              <div key={app._id} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[app.status]}`} />
                  <div>
                    <div className="text-sm font-medium text-white">{app.company}</div>
                    <div className="text-xs text-gray-500">{app.role}</div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[app.status]}`}>
                  {app.status}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </Layout>
  )
}