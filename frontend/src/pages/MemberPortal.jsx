import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import DiamondIcon from '@mui/icons-material/Diamond'
import PersonIcon from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'

const MemberPortal = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentTab = location.pathname.includes('/members')
    ? '/portal/members'
    : '/portal/mypage'

  const handleTabChange = (event, newValue) => {
    navigate(newValue)
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'rgba(60, 60, 60, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid transparent',
          borderImage: 'linear-gradient(90deg, rgba(212, 175, 55, 0.6), rgba(100, 149, 237, 0.5), rgba(212, 175, 55, 0.6)) 1',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(100, 149, 237, 0.2)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <DiamondIcon sx={{ color: '#d4af37', mr: 2, fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: '#d4af37',
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
          >
            NOBLESSE
          </Typography>
          <Typography variant="body2" sx={{ mr: 3, color: '#f5f5f5' }}>
            {user?.name} 様
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: '#d4af37',
              borderColor: '#d4af37',
              border: '1px solid',
              '&:hover': {
                bgcolor: 'rgba(212, 175, 55, 0.1)',
              },
            }}
          >
            ログアウト
          </Button>
        </Toolbar>
        <Box sx={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <Container maxWidth="xl">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: '#999',
                  fontWeight: 500,
                  fontSize: '1rem',
                  textTransform: 'none',
                  minHeight: 64,
                },
                '& .Mui-selected': {
                  color: '#d4af37 !important',
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(90deg, #d4af37 0%, #6495ed 100%)',
                  height: 3,
                },
              }}
            >
              <Tab
                label="マイページ"
                value="/portal/mypage"
                icon={<PersonIcon />}
                iconPosition="start"
              />
              <Tab
                label="女性会員一覧"
                value="/portal/members"
                icon={<PeopleIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Container>
        </Box>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default MemberPortal
