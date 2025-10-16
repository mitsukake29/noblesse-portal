import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import FavoriteIcon from '@mui/icons-material/Favorite'
import OfferModal from '../components/OfferModal'

const MemberDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showOfferModal, setShowOfferModal] = useState(false)

  useEffect(() => {
    fetchMember()
  }, [id])

  const fetchMember = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/members/${id}`)
      setMember(response.data)
      setError('')
    } catch (err) {
      setError('会員情報の取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#d4af37' }} />
      </Box>
    )
  }

  if (error || !member) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || '会員が見つかりません'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/portal/members')}
          sx={{ color: '#d4af37' }}
        >
          一覧に戻る
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/portal/members')}
          sx={{
            color: '#d4af37',
            '&:hover': {
              bgcolor: 'rgba(212, 175, 55, 0.1)',
            },
          }}
        >
          一覧に戻る
        </Button>
        <Button
          variant="contained"
          startIcon={<FavoriteIcon />}
          onClick={() => setShowOfferModal(true)}
          sx={{
            background: 'linear-gradient(135deg, #d4af37 0%, #6495ed 100%)',
            color: '#fff',
            fontWeight: 600,
            px: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #f0c861 0%, #7aa5f7 100%)',
            },
          }}
        >
          デートオファーを申し込む
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          bgcolor: 'rgba(60, 60, 60, 0.95)',
          border: '2px solid rgba(212, 175, 55, 0.5)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Image Section */}
          <Box
            sx={{
              width: { xs: '100%', md: '40%' },
              minHeight: { xs: 400, md: 600 },
              position: 'relative',
              bgcolor: '#2a2a2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            {member.image ? (
              <Box
                component="img"
                src={member.image}
                alt={member.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <PersonIcon sx={{ fontSize: 120, color: '#555' }} />
            )}

            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#d4af37', fontWeight: 600 }}
              >
                Privacy Protected Image
              </Typography>
            </Box>
          </Box>

          {/* Info Section */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 6 },
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: '#d4af37',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {member.name}
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              {member.age}歳
            </Typography>

            <Divider sx={{ my: 4, borderColor: 'rgba(212, 175, 55, 0.2)' }} />

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: '#d4af37', fontWeight: 600, mb: 2 }}
              >
                Profile
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#ccc',
                  lineHeight: 2,
                  fontSize: '1.1rem',
                  whiteSpace: 'pre-wrap',
                  mb: 3,
                }}
              >
                {member.introduction || 'プロフィール情報はありません'}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 3 }}>
                {member.occupation && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#d4af37' }}>職業</Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>{member.occupation}</Typography>
                  </Box>
                )}
                {member.bustCup && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#d4af37' }}>バスト</Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>{member.bustCup}カップ</Typography>
                  </Box>
                )}
                {member.hobbies && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#d4af37' }}>趣味</Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>{member.hobbies}</Typography>
                  </Box>
                )}
                {member.favoriteFoods && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#d4af37' }}>好物</Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>{member.favoriteFoods}</Typography>
                  </Box>
                )}
                {member.dislikedFoods && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#d4af37' }}>苦手な食べ物</Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>{member.dislikedFoods}</Typography>
                  </Box>
                )}
                {member.preferredLocations && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#d4af37' }}>都合が良いエリア</Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>{member.preferredLocations}</Typography>
                  </Box>
                )}
              </Box>

              {member.datingType && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: '#d4af37', display: 'block', mb: 1 }}>交際タイプ</Typography>
                  <Typography variant="body2" sx={{ color: '#f5f5f5', fontWeight: 500 }}>
                    {member.datingType === 'A' && 'Aタイプ：食事のみ'}
                    {member.datingType === 'B1' && 'B1タイプ：ゆっくり'}
                    {member.datingType === 'B2' && 'B2タイプ：2回目以降'}
                    {member.datingType === 'C' && 'Cタイプ：フィーリングが合えば初回から'}
                    {member.datingType === 'D' && 'Dタイプ：積極的'}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4, borderColor: 'rgba(212, 175, 55, 0.2)' }} />

            <Box
              sx={{
                p: 3,
                bgcolor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#d4af37', fontStyle: 'italic', textAlign: 'center' }}
              >
                詳細なご紹介をご希望の場合は、専属コンシェルジュまでお問い合わせください
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <OfferModal
        open={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        member={member}
        user={user}
      />
    </Box>
  )
}

export default MemberDetailPage
