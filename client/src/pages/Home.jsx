import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Menu, X, BarChart2, Bot, Bell, Shield } from 'lucide-react'

export default function Home() {
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
  ]

  const bg = dark ? '#030712' : '#ffffff'
  const text = dark ? '#ffffff' : '#111827'
  const subtext = dark ? '#9ca3af' : '#6b7280'
  const cardBg = dark ? '#111827' : '#f9fafb'
  const cardBorder = dark ? '#1f2937' : '#e5e7eb'
  const sectionBg = dark ? '#0f172a' : '#f9fafb'
  const innerCardBg = dark ? '#1f2937' : '#ffffff'

  return (
    <div style={{ background: bg, minHeight: '100vh', color: text, transition: 'background 0.3s, color 0.3s' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? (dark ? 'rgba(3,7,18,0.96)' : 'rgba(255,255,255,0.96)') : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${cardBorder}` : 'none',
        transition: 'all 0.3s'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed' }}>JobTracker</div>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: 14, fontWeight: 600, color: dark ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>
                {label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setDark(!dark)} style={{
              width: 36, height: 36, borderRadius: 8,
              background: dark ? '#1f2937' : '#f3f4f6',
              border: `1px solid ${cardBorder}`,
              color: dark ? '#9ca3af' : '#6b7280',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/login" style={{
              fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8,
              border: `1px solid ${cardBorder}`,
              color: dark ? '#d1d5db' : '#374151',
              textDecoration: 'none', background: 'transparent'
            }}>Login</Link>
            <Link to="/register" style={{
              fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 8,
              background: '#7c3aed', color: '#ffffff', textDecoration: 'none'
            }}>Get started</Link>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: dark ? '#0f172a' : '#ffffff',
            borderTop: `1px solid ${cardBorder}`,
            padding: '16px 24px'
          }}>
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', fontSize: 14, fontWeight: 600, color: dark ? '#d1d5db' : '#4b5563', textDecoration: 'none', padding: '8px 0' }}>
                {label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                style={{ flex: 1, textAlign: 'center', fontSize: 13, border: `1px solid ${cardBorder}`, color: dark ? '#d1d5db' : '#374151', padding: '8px', borderRadius: 8, textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                style={{ flex: 1, textAlign: 'center', fontSize: 13, background: '#7c3aed', color: '#ffffff', padding: '8px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>

        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: dark
              ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
              : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
          }} />
          <img
            src="/home-bg.png"
            alt="Office workspace"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: dark
              ? 'linear-gradient(to right, rgba(3,7,18,0.90) 0%, rgba(3,7,18,0.70) 55%, rgba(3,7,18,0.35) 100%)'
              : 'linear-gradient(to right, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.82) 55%, rgba(255,255,255,0.30) 100%)'
          }} />
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '128px 24px', width: '100%' }}>
          <div style={{ maxWidth: 560 }}>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(124,58,237,0.15)',
              color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)',
              padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 24
            }}>
              <span style={{ width: 6, height: 6, background: '#7c3aed', borderRadius: '50%', display: 'inline-block' }} />
              AI-powered job search assistant
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15,
              marginBottom: 20, color: dark ? '#ffffff' : '#111827'
            }}>
              Track every application.<br />
              <span style={{ color: '#7c3aed' }}>Land your dream role.</span>
            </h1>

            <p style={{
              fontSize: 17, fontWeight: 700,
              color: dark ? '#f3f4f6' : '#1f2937',
              marginBottom: 32, lineHeight: 1.7,
              textShadow: dark ? '0 1px 6px rgba(0,0,0,0.9)' : 'none'
            }}>
              JobTracker helps you manage all your job applications in one place, get AI-powered resume feedback, and never miss a deadline again.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
              <Link to="/register" style={{
                background: '#7c3aed', color: '#ffffff', fontWeight: 700,
                padding: '13px 28px', borderRadius: 12, fontSize: 15,
                textDecoration: 'none'
              }}>Get started free →</Link>
              <Link to="/login" style={{
                background: dark ? 'rgba(31,41,55,0.8)' : 'rgba(255,255,255,0.85)',
                color: dark ? '#ffffff' : '#111827',
                border: `1px solid ${dark ? '#374151' : '#d1d5db'}`,
                fontWeight: 600, padding: '13px 28px', borderRadius: 12, fontSize: 15,
                textDecoration: 'none', backdropFilter: 'blur(4px)'
              }}>Sign in</Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
              {[
                { num: '500+', label: 'Users' },
                { num: 'AI', label: 'Resume analyzer' },
                { num: '100%', label: 'Free' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#7c3aed' }}>{num}</div>
                  <div style={{
                    fontSize: 12, fontWeight: 700,
                    color: dark ? '#e5e7eb' : '#374151',
                    textShadow: dark ? '0 1px 4px rgba(0,0,0,0.9)' : 'none',
                    marginTop: 2
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{ padding: '96px 0', background: sectionBg, borderTop: `1px solid ${cardBorder}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                About JobTracker
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: text, marginBottom: 20, lineHeight: 1.2 }}>
                Your smart job search companion
              </h2>
              <p style={{ color: subtext, lineHeight: 1.75, marginBottom: 20, fontSize: 15 }}>
                JobTracker was built for students and fresh graduates who are navigating the overwhelming process of job hunting. We know how hard it is to keep track of dozens of applications, follow up at the right time, and tailor your CV for every role.
              </p>
              <p style={{ color: subtext, lineHeight: 1.75, marginBottom: 32, fontSize: 15 }}>
                That's why we built an all-in-one platform with an AI resume analyzer, application tracker, and smart analytics so you can focus on landing the job, not managing spreadsheets.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { num: '500+', label: 'Applications tracked' },
                  { num: 'AI', label: 'Powered analysis' },
                  { num: '100%', label: 'Free to use' },
                  { num: '24/7', label: 'Available anytime' },
                ].map(({ num, label }) => (
                  <div key={label} style={{ background: innerCardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#7c3aed' }}>{num}</div>
                    <div style={{ fontSize: 13, color: subtext, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo card */}
            <div style={{ background: innerCardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${cardBorder}` }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: dark ? 'rgba(124,58,237,0.2)' : '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#7c3aed' }}>A</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: text }}>Anya De Silva</div>
                  <div style={{ fontSize: 12, color: subtext }}>Computer Science Undergraduate</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, background: dark ? 'rgba(34,197,94,0.1)' : '#f0fdf4', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>Active</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { n: '12', l: 'Applied', c: '#7c3aed' },
                  { n: '4', l: 'Interviews', c: '#2563eb' },
                  { n: '1', l: 'Offers', c: '#16a34a' },
                ].map(({ n, l, c }) => (
                  <div key={l} style={{ background: dark ? 'rgba(55,65,81,0.5)' : '#f9fafb', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{n}</div>
                    <div style={{ fontSize: 11, color: subtext, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              {[
                { co: 'WSO2', ro: 'ML Intern', st: 'Interview', bg: dark ? 'rgba(37,99,235,0.1)' : '#eff6ff', c: '#2563eb' },
                { co: 'Dialog', ro: 'Data Analyst', st: 'Applied', bg: dark ? 'rgba(124,58,237,0.1)' : '#f5f3ff', c: '#7c3aed' },
                { co: 'Axiata', ro: 'Software Intern', st: 'Offer', bg: dark ? 'rgba(22,163,74,0.1)' : '#f0fdf4', c: '#16a34a' },
              ].map(({ co, ro, st, bg: itemBg, c }) => (
                <div key={co} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${cardBorder}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{co}</div>
                    <div style={{ fontSize: 11, color: subtext }}>{ro}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 600, background: itemBg, color: c }}>{st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '96px 0', background: bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Features</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: text, marginBottom: 16 }}>Everything you need to land the job</h2>
            <p style={{ color: subtext, maxWidth: 480, margin: '0 auto', fontSize: 14, lineHeight: 1.7 }}>
              From tracking applications to AI-powered resume feedback JobTracker has all the tools to supercharge your job search.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              { icon: BarChart2, title: 'Application tracker', desc: 'Track every application with status, deadlines, notes in one organized dashboard.', ibg: dark ? 'rgba(124,58,237,0.12)' : '#f5f3ff', ic: '#7c3aed' },
              { icon: Bot, title: 'AI resume analyzer', desc: 'Upload your CV and get an instant match score, missing keywords, and improvement suggestions.', ibg: dark ? 'rgba(37,99,235,0.12)' : '#eff6ff', ic: '#2563eb' },
              { icon: Bell, title: 'Deadline reminders', desc: 'Never miss an application deadline. Get notified when deadlines are approaching.', ibg: dark ? 'rgba(217,119,6,0.12)' : '#fffbeb', ic: '#d97706' },
              { icon: Shield, title: 'Secure & private', desc: 'Your data is protected with JWT authentication. Only you can see your applications.', ibg: dark ? 'rgba(22,163,74,0.12)' : '#f0fdf4', ic: '#16a34a' },
            ].map(({ icon: Icon, title, desc, ibg, ic }) => (
              <div key={title} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 24 }}>
                <div style={{ width: 42, height: 42, background: ibg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color={ic} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 12, color: subtext, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 0', background: '#7c3aed' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>Ready to land your dream job?</h2>
          <p style={{ color: '#ddd6fe', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
            Join hundreds of students already using JobTracker to organize their job search and get AI-powered resume feedback.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" style={{ background: '#ffffff', color: '#7c3aed', fontWeight: 800, padding: '13px 32px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>
              Create free account →
            </Link>
            <Link to="/login" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600, padding: '13px 32px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: sectionBg, borderTop: `1px solid ${cardBorder}`, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#7c3aed' }}>JobTracker</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: 12, color: subtext, textDecoration: 'none' }}>{label}</a>
            ))}
            <Link to="/login" style={{ fontSize: 12, color: subtext, textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ fontSize: 12, color: subtext, textDecoration: 'none' }}>Register</Link>
          </div>
          <div style={{ fontSize: 12, color: dark ? '#4b5563' : '#9ca3af' }}>© 2026 JobTracker. All rights reserved.</div>
        </div>
      </footer>

    </div>
  )
}