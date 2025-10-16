import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

const AdminLoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ username, password }, true)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 5,
            backgroundColor: 'rgba(60, 60, 60, 0.95)',
            border: '2px solid rgba(212, 175, 55, 0.6)',
            borderRadius: '4px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettingsIcon
              sx={{ fontSize: 64, color: '#d4af37', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom sx={{ color: '#d4af37' }}>
              管理者ログイン
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrator Access Only
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="ユーザー名"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="パスワード"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 4 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#d4af37',
                color: '#0a0a0a',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f0c861',
                },
              }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Default: admin / admin123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default AdminLoginPage
