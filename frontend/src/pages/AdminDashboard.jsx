import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Alert,
  Tabs,
  Tab,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import WomanIcon from '@mui/icons-material/Woman'
import ManIcon from '@mui/icons-material/Man'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockResetIcon from '@mui/icons-material/LockReset'
import AdminMemberCard from '../components/AdminMemberCard'
import UploadForm from '../components/UploadForm'
import MaleMemberForm from '../components/MaleMemberForm'
import PasswordChangeDialog from '../components/PasswordChangeDialog'
import MemberSearchPanel from '../components/MemberSearchPanel'

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [members, setMembers] = useState([])
  const [maleMembers, setMaleMembers] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showMaleMemberForm, setShowMaleMemberForm] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [editingMaleMember, setEditingMaleMember] = useState(null)
  const [changingPasswordMember, setChangingPasswordMember] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMembers()
    fetchMaleMembers()
    fetchOffers()
  }, [])

  const fetchMembers = async (searchParams = {}) => {
    try {
      setLoading(true)

      // Build query parameters
      const params = new URLSearchParams()
      if (searchParams.ageMin) params.append('ageMin', searchParams.ageMin)
      if (searchParams.ageMax) params.append('ageMax', searchParams.ageMax)
      if (searchParams.datingTypes && searchParams.datingTypes.length > 0) {
        searchParams.datingTypes.forEach(type => params.append('datingTypes', type))
      }
      if (searchParams.bustCups && searchParams.bustCups.length > 0) {
        searchParams.bustCups.forEach(cup => params.append('bustCups', cup))
      }
      if (searchParams.freeword) params.append('freeword', searchParams.freeword)

      const queryString = params.toString()
      const url = queryString ? `/api/admin/members?${queryString}` : '/api/admin/members'

      const response = await axios.get(url)
      setMembers(response.data)
      setError('')
    } catch (err) {
      setError('メンバー情報の取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberSearch = (searchParams) => {
    fetchMembers(searchParams)
  }

  const handleMemberSearchReset = () => {
    fetchMembers()
  }

  const fetchMaleMembers = async () => {
    try {
      const response = await axios.get('/api/male-members')
      setMaleMembers(response.data)
    } catch (err) {
      console.error('Error fetching male members:', err)
    }
  }

  const fetchOffers = async () => {
    try {
      const response = await axios.get('/api/offers')
      setOffers(response.data)
    } catch (err) {
      console.error('Error fetching offers:', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleAddNew = () => {
    setEditingMember(null)
    setShowUploadForm(true)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setShowUploadForm(true)
  }

  const handleDelete = async (memberId) => {
    if (!window.confirm('本当に削除しますか?')) return

    try {
      await axios.delete(`/api/admin/members/${memberId}`)
      await fetchMembers()
    } catch (err) {
      setError('削除に失敗しました')
      console.error(err)
    }
  }

  const handleFormClose = () => {
    setShowUploadForm(false)
    setEditingMember(null)
    fetchMembers()
  }

  const handleMaleMemberAdd = () => {
    setEditingMaleMember(null)
    setShowMaleMemberForm(true)
  }

  const handleMaleMemberEdit = (member) => {
    setEditingMaleMember(member)
    setShowMaleMemberForm(true)
  }

  const handleMaleMemberDelete = async (memberId) => {
    if (!window.confirm('本当に削除しますか?')) return

    try {
      await axios.delete(`/api/male-members/${memberId}`)
      await fetchMaleMembers()
    } catch (err) {
      setError('削除に失敗しました')
      console.error(err)
    }
  }

  const handleMaleMemberFormClose = () => {
    setShowMaleMemberForm(false)
    setEditingMaleMember(null)
  }

  const handleMaleMemberFormSuccess = () => {
    fetchMaleMembers()
  }

  const handlePasswordChange = (member) => {
    setChangingPasswordMember(member)
    setShowPasswordDialog(true)
  }

  const handlePasswordDialogClose = () => {
    setShowPasswordDialog(false)
    setChangingPasswordMember(null)
  }

  const handlePasswordChangeSuccess = () => {
    fetchMaleMembers()
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#3a3a3a' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#d4af37' }}>
            管理者ダッシュボード
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: '#d4af37' }}
          >
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: '#999',
                fontWeight: 500,
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: '#d4af37 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#d4af37',
              },
            }}
          >
            <Tab icon={<WomanIcon />} iconPosition="start" label="女性会員管理" />
            <Tab icon={<ManIcon />} iconPosition="start" label="男性会員管理" />
            <Tab icon={<FavoriteIcon />} iconPosition="start" label="オファー一覧" />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ color: '#f5f5f5' }}>
                女性会員管理
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                sx={{
                  bgcolor: '#d4af37',
                  color: '#0a0a0a',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#f0c861',
                  },
                }}
              >
                新規登録
              </Button>
            </Box>

            <MemberSearchPanel onSearch={handleMemberSearch} onReset={handleMemberSearchReset} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Typography sx={{ textAlign: 'center', py: 4 }}>読み込み中...</Typography>
        ) : (
          <Grid container spacing={3}>
            {members.map((member) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
                <AdminMemberCard
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        )}

            {members.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  登録されている会員がいません
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  「新規登録」ボタンから会員を追加してください
                </Typography>
              </Box>
            )}
          </>
        )}

        {currentTab === 1 && (
          <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ color: '#f5f5f5' }}>
                男性会員管理
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleMaleMemberAdd}
                sx={{
                  bgcolor: '#d4af37',
                  color: '#0a0a0a',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#f0c861',
                  },
                }}
              >
                新規登録
              </Button>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              男性会員: {maleMembers.length}名
            </Typography>
            <Grid container spacing={3}>
              {maleMembers.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Box sx={{
                    p: 3,
                    bgcolor: 'rgba(60, 60, 60, 0.9)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#d4af37',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                    }
                  }}>
                    <Typography variant="h6" sx={{ color: '#d4af37', mb: 2 }}>{member.name}</Typography>
                    <Typography variant="body2" color="text.secondary">年齢: {member.age}歳</Typography>
                    <Typography variant="body2" color="text.secondary">会員ID: {member.memberId}</Typography>
                    <Typography variant="body2" color="text.secondary">Email: {member.email}</Typography>
                    <Typography variant="body2" color="text.secondary">電話: {member.phone}</Typography>
                    <Typography variant="body2" color="text.secondary">住所: {member.address}</Typography>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleMaleMemberEdit(member)}
                        sx={{
                          color: '#d4af37',
                          borderColor: '#d4af37',
                          '&:hover': {
                            borderColor: '#f0c861',
                            bgcolor: 'rgba(212, 175, 55, 0.1)',
                          },
                        }}
                      >
                        編集
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<LockResetIcon />}
                        onClick={() => handlePasswordChange(member)}
                        sx={{
                          color: '#6495ed',
                          borderColor: '#6495ed',
                          '&:hover': {
                            borderColor: '#87ceeb',
                            bgcolor: 'rgba(100, 149, 237, 0.1)',
                          },
                        }}
                      >
                        パスワード
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleMaleMemberDelete(member.id)}
                        sx={{
                          color: '#ff4444',
                          borderColor: '#ff4444',
                          '&:hover': {
                            borderColor: '#ff6666',
                            bgcolor: 'rgba(255, 68, 68, 0.1)',
                          },
                        }}
                      >
                        削除
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {currentTab === 2 && (
          <Box>
            <Typography variant="h4" sx={{ color: '#f5f5f5', mb: 4 }}>
              デートオファー一覧
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              オファー総数: {offers.length}件
            </Typography>
            <Grid container spacing={3}>
              {offers.map((offer) => (
                <Grid item xs={12} md={6} key={offer.id}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(60, 60, 60, 0.9)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    <Typography variant="h6" sx={{ color: '#d4af37', mb: 2 }}>
                      {offer.maleMemberName} → {offer.femaleMemberName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">待ち合わせ場所: {offer.meetingPlace}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>希望日程:</Typography>
                    {offer.preferredDates.map((date, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: '#ccc', ml: 2 }}>
                        • {date}
                      </Typography>
                    ))}
                    <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 2 }}>
                      申込日時: {new Date(offer.createdAt).toLocaleString('ja-JP')}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <UploadForm
        open={showUploadForm}
        onClose={handleFormClose}
        editingMember={editingMember}
      />

      <MaleMemberForm
        open={showMaleMemberForm}
        onClose={handleMaleMemberFormClose}
        editingMember={editingMaleMember}
        onSuccess={handleMaleMemberFormSuccess}
      />

      <PasswordChangeDialog
        open={showPasswordDialog}
        onClose={handlePasswordDialogClose}
        member={changingPasswordMember}
        onSuccess={handlePasswordChangeSuccess}
      />
    </Box>
  )
}

export default AdminDashboard
