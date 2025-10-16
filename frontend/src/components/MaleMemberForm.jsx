import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material'

const MaleMemberForm = ({ open, onClose, editingMember, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    memberId: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || '',
        age: editingMember.age || '',
        memberId: editingMember.memberId || '',
        email: editingMember.email || '',
        phone: editingMember.phone || '',
        address: editingMember.address || '',
      })
    } else {
      resetForm()
    }
  }, [editingMember, open])

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      memberId: '',
      email: '',
      phone: '',
      address: '',
    })
    setError('')
    setSuccess('')
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!formData.name || !formData.age || !formData.memberId) {
        setError('名前、年齢、会員IDは必須です')
        setLoading(false)
        return
      }

      if (editingMember) {
        await axios.put(`/api/male-members/${editingMember.id}`, formData)
        setSuccess('男性会員情報を更新しました')
      } else {
        await axios.post('/api/male-members', formData)
        setSuccess('男性会員を登録しました')
      }

      setTimeout(() => {
        onSuccess()
        onClose()
        resetForm()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || '処理に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ color: '#d4af37' }}>
        {editingMember ? '男性会員情報編集' : '男性会員新規登録'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="名前"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="年齢"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="会員ID"
                name="memberId"
                value={formData.memberId}
                onChange={handleInputChange}
                required
                placeholder="例: NM-001"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="メールアドレス"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="電話番号"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="例: 090-1234-5678"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="住所"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="例: 東京都港区"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={loading}>
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="contained"
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
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                処理中...
              </>
            ) : editingMember ? (
              '更新'
            ) : (
              '登録'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default MaleMemberForm
