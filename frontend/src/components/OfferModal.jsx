import { useState } from 'react'
import axios from 'axios'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Step,
  Stepper,
  StepLabel,
  IconButton,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

const OfferModal = ({ open, onClose, member, user }) => {
  const [step, setStep] = useState(0) // 0: 入力, 1: 確認
  const [preferredDates, setPreferredDates] = useState([null, null, null])
  const [preferredTimes, setPreferredTimes] = useState(['', '', ''])
  const [meetingPlace, setMeetingPlace] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClose = () => {
    setStep(0)
    setPreferredDates([null, null, null])
    setPreferredTimes(['', '', ''])
    setMeetingPlace('')
    setError('')
    setSuccess('')
    onClose()
  }

  const handleDateChange = (index, value) => {
    const newDates = [...preferredDates]
    newDates[index] = value
    setPreferredDates(newDates)
  }

  const handleTimeChange = (index, value) => {
    const newTimes = [...preferredTimes]
    newTimes[index] = value
    setPreferredTimes(newTimes)
  }

  const formatDateTimeString = (date, time) => {
    if (!date) return ''
    const dateStr = new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
    return time ? `${dateStr} ${time}` : dateStr
  }

  const handleNext = () => {
    const filledDates = preferredDates.filter(date => date !== null)
    if (filledDates.length === 0) {
      setError('希望日程を最低1つ選択してください')
      return
    }
    if (!meetingPlace.trim()) {
      setError('待ち合わせ場所を入力してください')
      return
    }
    setError('')
    setStep(1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const formattedDates = preferredDates
        .map((date, index) => {
          if (date === null) return null
          return formatDateTimeString(date, preferredTimes[index])
        })
        .filter(date => date !== null)

      await axios.post('/api/offers', {
        maleMemberId: user.id,
        maleMemberName: user.name,
        femaleMemberId: member.id,
        femaleMemberName: member.name,
        preferredDates: formattedDates,
        meetingPlace,
      })

      setSuccess('オファーを送信しました！')
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'オファーの送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          border: '2px solid rgba(212, 175, 55, 0.5)',
        },
      }}
    >
      <DialogTitle sx={{ color: '#d4af37', fontWeight: 600 }}>
        デートオファー申込み
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          <Step>
            <StepLabel sx={{ '& .MuiStepLabel-label': { color: '#ccc' } }}>
              希望日程・場所の入力
            </StepLabel>
          </Step>
          <Step>
            <StepLabel sx={{ '& .MuiStepLabel-label': { color: '#ccc' } }}>
              確認
            </StepLabel>
          </Step>
        </Stepper>

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

        {step === 0 && (
          <Box>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 600 }}>
                オファー先
              </Typography>
              <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
                {member?.name} さん
              </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
              希望日程（最大3つ）
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              日付をカレンダーから選択し、時間帯を入力してください
            </Typography>

            {preferredDates.map((date, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#ccc', mb: 1, display: 'block' }}>
                  第{index + 1}希望
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    type="date"
                    value={date ? new Date(date).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange(index, e.target.value ? new Date(e.target.value) : null)}
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0]
                    }}
                  />
                  <TextField
                    type="time"
                    value={preferredTimes[index]}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    placeholder="時間帯（任意）"
                  />
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 3, borderColor: 'rgba(212, 175, 55, 0.2)' }} />

            <Typography variant="subtitle1" sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
              待ち合わせ場所
            </Typography>
            <TextField
              fullWidth
              label="待ち合わせ場所"
              value={meetingPlace}
              onChange={(e) => setMeetingPlace(e.target.value)}
              multiline
              rows={2}
              placeholder="例: 銀座駅改札、六本木ヒルズ正面玄関など"
              required
            />
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
              以下の内容でオファーを送信します
            </Typography>

            <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(60, 60, 60, 0.9)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                申込者
              </Typography>
              <Typography variant="body1" sx={{ color: '#f5f5f5', mb: 2 }}>
                {user?.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                オファー先
              </Typography>
              <Typography variant="body1" sx={{ color: '#f5f5f5', mb: 2 }}>
                {member?.name} さん
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                希望日程
              </Typography>
              {preferredDates
                .map((date, idx) => {
                  if (date === null) return null
                  return (
                    <Typography key={idx} variant="body1" sx={{ color: '#f5f5f5', ml: 2 }}>
                      • {formatDateTimeString(date, preferredTimes[idx])}
                    </Typography>
                  )
                })
                .filter(item => item !== null)
              }

              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                待ち合わせ場所
              </Typography>
              <Typography variant="body1" sx={{ color: '#f5f5f5' }}>
                {meetingPlace}
              </Typography>
            </Box>

            <Alert severity="info">
              送信後、管理者が確認し、女性会員にオファー内容をお伝えします。
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading}>
          キャンセル
        </Button>
        {step === 0 && (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              bgcolor: '#d4af37',
              color: '#0a0a0a',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f0c861',
              },
            }}
          >
            確認画面へ
          </Button>
        )}
        {step === 1 && (
          <>
            <Button
              onClick={() => setStep(0)}
              disabled={loading}
              sx={{ color: '#d4af37' }}
            >
              戻る
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<SendIcon />}
              sx={{
                background: 'linear-gradient(135deg, #d4af37 0%, #6495ed 100%)',
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #f0c861 0%, #7aa5f7 100%)',
                },
              }}
            >
              {loading ? '送信中...' : 'オファーを送信'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default OfferModal
