import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import MemberPortal from './pages/MemberPortal'
import MemberListPage from './pages/MemberListPage'
import MemberDetailPage from './pages/MemberDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import MyPage from './pages/MyPage'

// Luxury theme - Black × Gold
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37', // Gold
      light: '#f0c861',
      dark: '#b8942e',
    },
    secondary: {
      main: '#1a1a2e', // Dark Navy
      light: '#2d2d44',
      dark: '#0f0f1e',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#d4af37',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Noto Serif JP", serif',
    h1: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h3: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      letterSpacing: '0.01em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontWeight: 500,
          padding: '12px 32px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid rgba(212, 175, 55, 0.2)',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Member routes */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <MemberPortal />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/portal/mypage" replace />} />
              <Route path="mypage" element={<MyPage />} />
              <Route path="members" element={<MemberListPage />} />
              <Route path="members/:id" element={<MemberDetailPage />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
