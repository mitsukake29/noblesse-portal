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
  Typography,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const UploadForm = ({ open, onClose, editingMember }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    introduction: '',
    bustCup: '',
    occupation: '',
    hobbies: '',
    favoriteFoods: '',
    dislikedFoods: '',
    preferredLocations: '',
    datingType: 'A',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || '',
        age: editingMember.age || '',
        introduction: editingMember.introduction || '',
        bustCup: editingMember.bustCup || '',
        occupation: editingMember.occupation || '',
        hobbies: editingMember.hobbies || '',
        favoriteFoods: editingMember.favoriteFoods || '',
        dislikedFoods: editingMember.dislikedFoods || '',
        preferredLocations: editingMember.preferredLocations || '',
        datingType: editingMember.datingType || 'A',
      })
      if (editingMember.blurredImage) {
        setPreview(editingMember.blurredImage)
      }
    } else {
      resetForm()
    }
  }, [editingMember, open])

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      introduction: '',
      bustCup: '',
      occupation: '',
      hobbies: '',
      favoriteFoods: '',
      dislikedFoods: '',
      preferredLocations: '',
      datingType: 'A',
    })
    setSelectedFile(null)
    setPreview(null)
    setError('')
    setSuccess('')
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('age', formData.age)
      formDataToSend.append('introduction', formData.introduction)
      formDataToSend.append('bustCup', formData.bustCup)
      formDataToSend.append('occupation', formData.occupation)
      formDataToSend.append('hobbies', formData.hobbies)
      formDataToSend.append('favoriteFoods', formData.favoriteFoods)
      formDataToSend.append('dislikedFoods', formData.dislikedFoods)
      formDataToSend.append('preferredLocations', formData.preferredLocations)
      formDataToSend.append('datingType', formData.datingType)

      if (selectedFile) {
        formDataToSend.append('photo', selectedFile)
      }

      if (editingMember) {
        await axios.put(`/api/admin/members/${editingMember.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setSuccess('メンバー情報を更新しました。')
      } else {
        await axios.post('/api/admin/members', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setSuccess('メンバーを登録しました。')
      }

      setTimeout(() => {
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ color: '#d4af37' }}>
        {editingMember ? '会員情報編集' : '新規会員登録'}
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

          <TextField
            fullWidth
            label="名前"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="年齢"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="紹介文"
            name="introduction"
            value={formData.introduction}
            onChange={handleInputChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>バストカップ</InputLabel>
                <Select
                  name="bustCup"
                  value={formData.bustCup}
                  onChange={handleInputChange}
                  label="バストカップ"
                >
                  <MenuItem value="">選択してください</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                  <MenuItem value="G">G</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="職業"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="趣味"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="好物"
                name="favoriteFoods"
                value={formData.favoriteFoods}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="苦手な食べ物"
                name="dislikedFoods"
                value={formData.dislikedFoods}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="都合が良いアクセス場所"
            name="preferredLocations"
            value={formData.preferredLocations}
            onChange={handleInputChange}
            placeholder="例: 渋谷、銀座、六本木"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>交際タイプ</InputLabel>
            <Select
              name="datingType"
              value={formData.datingType}
              onChange={handleInputChange}
              label="交際タイプ"
            >
              <MenuItem value="A">Aタイプ：食事のみ</MenuItem>
              <MenuItem value="B1">B1タイプ：ゆっくり</MenuItem>
              <MenuItem value="B2">B2タイプ：2回目以降</MenuItem>
              <MenuItem value="C">Cタイプ：フィーリングが合えば初回から</MenuItem>
              <MenuItem value="D">Dタイプ：積極的</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                color: '#d4af37',
                borderColor: '#d4af37',
                '&:hover': {
                  borderColor: '#f0c861',
                  bgcolor: 'rgba(212, 175, 55, 0.1)',
                },
              }}
            >
              写真をアップロード
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="caption" sx={{ ml: 2, color: '#ccc' }}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>

          {preview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                プレビュー
              </Typography>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '4px',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                }}
              />
            </Box>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            アップロードされた写真はそのまま保存されます。
          </Alert>
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

export default UploadForm
