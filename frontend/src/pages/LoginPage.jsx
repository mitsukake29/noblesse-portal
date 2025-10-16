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
  Divider,
} from '@mui/material'
import DiamondIcon from '@mui/icons-material/Diamond'

const LoginPage = () => {
  const [email, setEmail] = useState('')
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
      await login({ email, password }, false)
      navigate('/portal')
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
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 50% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(100, 149, 237, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 10% 50%, rgba(100, 149, 237, 0.08) 0%, transparent 40%)',
          animation: 'pulse 8s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            backgroundColor: 'rgba(60, 60, 60, 0.95)',
            border: '2px solid rgba(212, 175, 55, 0.6)',
            borderRadius: '4px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(212, 175, 55, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
              animation: 'shimmer 3s infinite',
            },
            '@keyframes shimmer': {
              '0%': { left: '-100%' },
              '100%': { left: '100%' },
            },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <DiamondIcon
              sx={{ fontSize: 72, color: '#d4af37', mb: 2 }}
            />
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: '#d4af37',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              NOBLESSE
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(212, 175, 55, 0.2)' }} />
            <Typography variant="h6" sx={{ color: '#f5f5f5', mt: 2 }}>
              Member Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Exclusive Access for Distinguished Members
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
              label="メールアドレス"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                background: 'linear-gradient(135deg, #d4af37 0%, #6495ed 100%)',
                color: '#0a0a0a',
                fontWeight: 700,
                fontSize: '1.1rem',
                py: 1.5,
                letterSpacing: '0.05em',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #6495ed 0%, #d4af37 100%)',
                  transition: 'left 0.3s ease',
                },
                '&:hover::before': {
                  left: 0,
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4), 0 8px 24px rgba(100, 149, 237, 0.2)',
                },
                '& span': {
                  position: 'relative',
                  zIndex: 1,
                },
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'ログイン中...' : 'ENTER'}
            </Button>
          </form>

          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(212, 175, 55, 0.05)', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              テストアカウント:
            </Typography>
            <Typography variant="caption" sx={{ color: '#d4af37' }}>
              member@noblesse.com / noblesse123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
