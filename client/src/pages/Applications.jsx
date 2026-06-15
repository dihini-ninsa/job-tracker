import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

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

const emptyForm = {
  company: '',
  role: '',
  dateApplied: '',
  deadline: '',
  status: 'Applied',
  jobDescription: '',
  notes: ''
}

export default function Applications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications')
      setApplications(data)
    } catch (err) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        const { data } = await API.put(`/applications/${editId}`, form)
        setApplications(applications.map(a => a._id === editId ? data : a))
        toast.success('Application updated!')
      } else {
        const { data } = await API.post('/applications', form)
        setApplications([data, ...applications])
        toast.success('Application added!')
      }
      setForm(emptyForm)
      setShowForm(false)
      setEditId(null)
    } catch (err) {
      toast.error('Failed to save application')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (app) => {
    setForm({
      company: app.company,
      role: app.role,
      dateApplied: app.dateApplied?.split('T')[0] || '',
      deadline: app.deadline?.split('T')[0] || '',
      status: app.status,
      jobDescription: app.jobDescription || '',
      notes: app.notes || ''
    })
    setEditId(app._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await API.delete(`/applications/${id}`)
      setApplications(applications.filter(a => a._id !== id))
      toast.success('Application deleted')
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const exportToCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications to export')
      return
    }
    const headers = ['Company', 'Role', 'Date Applied', 'Deadline', 'Status', 'Notes']
    const rows = applications.map(a => [
      a.company,
      a.role,
      a.dateApplied ? new Date(a.dateApplied).toLocaleDateString() : '',
      a.deadline ? new Date(a.deadline).toLocaleDateString() : '',
      a.status,
      (a.notes || '').replace(/"/g, '""')
    ])
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${v}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported to CSV!')
  }

  const isOverdue = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  const counts = {
    All: applications.length,
    Applied: applications.filter(a => a.status === 'Applied').length,
    Interview: applications.filter(a => a.status === 'Interview').length,
    Offer: applications.filter(a => a.status === 'Offer').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  }

  const filtered = applications
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a =>
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'company') return a.company.localeCompare(b.company)
      if (sortBy === 'deadline') return new Date(a.deadline || '9999') - new Date(b.deadline || '9999')
      return 0
    })

  return (
    <Layout>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-gray-400 text-sm mt-1">
            {counts.All} total · {counts.Interview} interviews · {counts.Offer} offers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 border border-gray-700"
          >
            ⬇️ Export CSV
          </button>
          <button
            onClick={() => {
              setForm(emptyForm)
              setEditId(null)
              setShowForm(!showForm)
            }}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            + Add new
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6"
          >
            <h3 className="text-sm font-semibold text-white mb-5">
              {editId ? '✏️ Edit application' : '➕ Add new application'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Company *</label>
                  <input
                    name="company" value={form.company} onChange={handleChange} required
                    placeholder="e.g. WSO2"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Role *</label>
                  <input
                    name="role" value={form.role} onChange={handleChange} required
                    placeholder="e.g. ML Intern"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Date applied</label>
                  <input
                    type="date" name="dateApplied" value={form.dateApplied} onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Deadline</label>
                  <input
                    type="date" name="deadline" value={form.deadline} onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1.5">Status</label>
                  <select
                    name="status" value={form.status} onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-400 font-medium block mb-1.5">Notes</label>
                <textarea
                  name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Any notes about this application..."
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-gray-600"
                />
              </div>
              <div className="mb-5">
                <label className="text-xs text-gray-400 font-medium block mb-1.5">
                  Job description
                  <span className="text-gray-600 font-normal ml-1">(used for AI analysis)</span>
                </label>
                <textarea
                  name="jobDescription" value={form.jobDescription} onChange={handleChange}
                  placeholder="Paste the job description here..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-gray-600"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                  {saving ? 'Saving...' : editId ? 'Update application' : 'Save application'}
                </button>
                <button type="button"
                  onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-5 py-2 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters + Search + Sort */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                filter === f
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-600 w-48"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A-Z</option>
            <option value="deadline">By deadline</option>
          </select>
        </div>
      </div>

      {/* Applications table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-800 rounded w-32 mb-1.5"></div>
                  <div className="h-2.5 bg-gray-800 rounded w-24"></div>
                </div>
                <div className="h-3 bg-gray-800 rounded w-20"></div>
                <div className="h-5 bg-gray-800 rounded-full w-16"></div>
                <div className="h-7 bg-gray-800 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-gray-500 text-sm mb-4">
              {search ? 'No applications match your search' : 'No applications found'}
            </div>
            {!search && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Add your first application
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Company</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Role</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Applied</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Deadline</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Status</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <motion.tr
                  key={app._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[app.status]}`} />
                      <span className="text-sm font-medium text-white">{app.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{app.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {app.deadline ? (
                      <span className={`font-medium ${isOverdue(app.deadline) ? 'text-red-400' : 'text-gray-400'}`}>
                        {isOverdue(app.deadline) ? '⚠️ ' : ''}
                        {new Date(app.deadline).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(app)}
                        className="text-xs text-gray-400 hover:text-violet-400 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="text-xs text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary footer */}
      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>Showing {filtered.length} of {applications.length} applications</span>
          <span>
            {applications.filter(a => a.deadline && isOverdue(a.deadline)).length > 0 && (
              <span className="text-red-400">
                ⚠️ {applications.filter(a => a.deadline && isOverdue(a.deadline)).length} overdue deadline(s)
              </span>
            )}
          </span>
        </div>
      )}

    </Layout>
  )
}