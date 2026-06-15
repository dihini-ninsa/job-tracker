import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Briefcase, Bot, User, LogOut, Shield } from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/applications', label: 'Applications', icon: Briefcase },
    { path: '/analyzer', label: 'AI Analyzer', icon: Bot },
  ]

  const accountItems = [
    { path: '/profile', label: 'Profile', icon: User },
  ]

  const linkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
    borderRadius: 10, fontSize: 14, textDecoration: 'none', transition: 'all 0.15s',
    background: active ? '#1f2937' : 'transparent',
    color: '#9ca3af',
    fontWeight: active ? 500 : 400,
    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left'
  })

  const iconStyle = { color: '#6b7280', flexShrink: 0 }

  return (
    <aside style={{
      width: 240, background: '#111827', borderRight: '1px solid #1f2937',
      display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', zIndex: 10
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed' }}>JobTracker</div>
      </div>

      <nav style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 11, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 12px 4px' }}>Main</div>

        {navItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} style={linkStyle(location.pathname === path)}>
            <Icon size={16} style={iconStyle} />
            {label}
          </Link>
        ))}

        <div style={{ fontSize: 11, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 12px 4px' }}>Account</div>

        {accountItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} style={linkStyle(location.pathname === path)}>
            <Icon size={16} style={iconStyle} />
            {label}
          </Link>
        ))}

        {user?.isAdmin && (
          <>
            <div style={{ fontSize: 11, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 12px 4px' }}>Admin</div>
            <Link to="/admin" style={linkStyle(location.pathname === '/admin')}>
              <Shield size={16} style={iconStyle} />
              Admin Panel
            </Link>
          </>
        )}

        <button onClick={handleLogout} style={{ ...linkStyle(false), marginTop: 4, background: 'transparent' }}>
          <LogOut size={16} style={iconStyle} />
          Logout
        </button>
      </nav>

      <div style={{ padding: 16, borderTop: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#7c3aed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontSize: 11, fontWeight: 700, flexShrink: 0
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.targetRole || 'Student'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}