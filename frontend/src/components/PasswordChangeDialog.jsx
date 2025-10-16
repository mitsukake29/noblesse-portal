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
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'

const PasswordChangeDialog = ({ open, onClose, member, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validation, setValidation] = useState(null)

  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  useEffect(() => {
    // Real-time password validation
    const validatePasswordRealtime = async () => {
      if (!newPassword) {
        setValidation(null)
        return
      }

      try {
        const response = await axios.post('/api/male-members/validate-password', {
          password: newPassword
        })
        setValidation(response.data)
      } catch (err) {
        console.error('Validation error:', err)
      }
    }

    const debounceTimer = setTimeout(validatePasswordRealtime, 300)
    return () => clearTimeout(debounceTimer)
  }, [newPassword])

  const resetForm = () => {
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    setValidation(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword) {
      setError('新しいパスワードを入力してください')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (validation && !validation.valid) {
      setError('パスワードが要件を満たしていません')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`/api/male-members/${member.id}/change-password`, {
        newPassword,
        adminUser: 'admin' // 本番環境では実際のログインユーザー名を使用
      })

      setSuccess(`パスワードを変更しました（強度: ${getStrengthLabel(response.data.passwordStrength)}）`)

      setTimeout(() => {
        onSuccess()
        onClose()
        resetForm()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'パスワード変更に失敗しました')
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join('\n'))
      }
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return '#4caf50'
      case 'medium': return '#ff9800'
      case 'weak': return '#f44336'
      default: return '#999'
    }
  }

  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 'strong': return '強い'
      case 'medium': return '普通'
      case 'weak': return '弱い'
      default: return '不明'
    }
  }

  const getStrengthIcon = (strength) => {
    switch (strength) {
      case 'strong': return <CheckCircleIcon />
      case 'medium': return <WarningIcon />
      case 'weak': return <ErrorIcon />
      default: return null
    }
  }

  const getStrengthProgress = (strength) => {
    switch (strength) {
      case 'strong': return 100
      case 'medium': return 60
      case 'weak': return 30
      default: return 0
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ color: '#d4af37', display: 'flex', alignItems: 'center', gap: 1 }}>
        <LockIcon />
        パスワード変更 - {member?.name}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {member?.passwordUpdatedAt && (
            <Alert severity="info" sx={{ mb: 2 }}>
              最終更新: {new Date(member.passwordUpdatedAt).toLocaleString('ja-JP')}
              {member.passwordUpdatedBy && ` (変更者: ${member.passwordUpdatedBy})`}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
              パスワード要件:
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
              • 8文字以上
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
              • 大文字を1文字以上含む
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
              • 小文字を1文字以上含む
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
              • 数字を1文字以上含む
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="新しいパスワード"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            autoComplete="new-password"
          />

          {validation && newPassword && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  パスワード強度:
                </Typography>
                <Chip
                  label={getStrengthLabel(validation.strength)}
                  size="small"
                  icon={getStrengthIcon(validation.strength)}
                  sx={{
                    bgcolor: getStrengthColor(validation.strength),
                    color: '#fff',
                  }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={getStrengthProgress(validation.strength)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#333',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getStrengthColor(validation.strength),
                  },
                }}
              />
              {validation.errors && validation.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {validation.errors.map((err, idx) => (
                    <Typography key={idx} variant="caption" sx={{ color: '#f44336', display: 'block' }}>
                      • {err}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <TextField
            fullWidth
            label="パスワード（確認）"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={confirmPassword && newPassword !== confirmPassword}
            helperText={confirmPassword && newPassword !== confirmPassword ? 'パスワードが一致しません' : ''}
            autoComplete="new-password"
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={loading}>
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (validation && !validation.valid)}
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
                <CircularProgress size={20} sx={{ mr: 1, color: '#0a0a0a' }} />
                変更中...
              </>
            ) : (
              'パスワードを変更'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PasswordChangeDialog
