import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#0a0a0a"
      >
        <CircularProgress sx={{ color: '#d4af37' }} />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/portal" replace />
  }

  return children
}

export default ProtectedRoute
