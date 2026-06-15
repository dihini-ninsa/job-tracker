import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Toast from './components/Toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import Analyzer from './pages/Analyzer'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.isAdmin) return <Navigate to="/admin" />
  return children
}

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/admin-login" />
  if (!user.isAdmin) return <Navigate to="/" />
  return children
}

const AppRoutes = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={!user ? <Home /> : user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <Login /> : user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />} />
      <Route path="/admin-login" element={!user ? <AdminLogin /> : user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
      <Route path="/analyzer" element={<PrivateRoute><Analyzer /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}