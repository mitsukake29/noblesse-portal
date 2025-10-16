import { useAuth } from '../context/AuthContext'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material'
import DiamondIcon from '@mui/icons-material/Diamond'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'

const MyPage = () => {
  const { user } = useAuth()

  return (
    <Box>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          background: 'linear-gradient(135deg, #d4af37 0%, #6495ed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
          mb: 1,
          letterSpacing: '0.02em',
        }}
      >
        Welcome Back
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
        {user?.name} 様のマイページ
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: '#1a1a1a',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <DiamondIcon sx={{ color: '#d4af37', fontSize: 40, mr: 2 }} />
              <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 600 }}>
                会員情報
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(212, 175, 55, 0.2)' }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                お名前
              </Typography>
              <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
                {user?.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                年齢
              </Typography>
              <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
                {user?.age}歳
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                メールアドレス
              </Typography>
              <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
                {user?.email}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 600 }}>
                会員ステータス: PREMIUM
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Benefits Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: 'rgba(60, 60, 60, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '2px',
              height: '100%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CardGiftcardIcon sx={{ color: '#d4af37', fontSize: 40, mr: 2 }} />
              <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 600 }}>
                保有特典
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(212, 175, 55, 0.2)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {user?.benefits && user.benefits.length > 0 ? (
                user.benefits.map((benefit) => (
                  <Card
                    key={benefit.id}
                    sx={{
                      bgcolor: 'rgba(212, 175, 55, 0.05)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: '#d4af37', fontWeight: 600 }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        {benefit.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  現在、特典はありません
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Info */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 4,
          bgcolor: 'rgba(212, 175, 55, 0.03)',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" sx={{ color: '#d4af37', fontStyle: 'italic' }}>
          "Noblesse Oblige - 高貴なる者の義務"
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          当サービスは厳選されたノブレス会員様のみがご利用いただける特別なポータルサイトです。
          <br />
          上質な出会いと洗練された時間をお楽しみください。
        </Typography>
      </Paper>
    </Box>
  )
}

export default MyPage
