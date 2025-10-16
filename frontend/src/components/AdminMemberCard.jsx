import { useState } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const AdminMemberCard = ({ member, onEdit, onDelete }) => {
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'rgba(60, 60, 60, 0.9)',
        border: '2px solid rgba(212, 175, 55, 0.5)',
        borderRadius: '2px',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: '#e5c158',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(212, 175, 55, 0.45)',
          bgcolor: 'rgba(70, 70, 70, 0.95)',
        },
      }}
    >
      {member.originalImage ? (
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={showOriginal ? member.originalImage : member.blurredImage}
            alt={member.name}
            sx={{
              width: '100%',
              height: 450,
              objectFit: 'cover',
              objectPosition: 'center center',
            }}
          />
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
            <ToggleButtonGroup
              value={showOriginal}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) setShowOriginal(newValue)
              }}
              size="small"
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(5px)',
              }}
            >
              <ToggleButton
                value={false}
                sx={{
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&.Mui-selected': {
                    bgcolor: '#d4af37',
                    color: '#0a0a0a',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#f0c861',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(212, 175, 55, 0.2)',
                  },
                }}
              >
                <VisibilityOffIcon sx={{ fontSize: 18, mr: 0.5 }} />
                ぼかし
              </ToggleButton>
              <ToggleButton
                value={true}
                sx={{
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&.Mui-selected': {
                    bgcolor: '#d4af37',
                    color: '#0a0a0a',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#f0c861',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(212, 175, 55, 0.2)',
                  },
                }}
              >
                <VisibilityIcon sx={{ fontSize: 18, mr: 0.5 }} />
                オリジナル
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: 450,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#4a4a4a',
          }}
        >
          <ImageIcon sx={{ fontSize: 64, color: '#888' }} />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#f5f5f5' }}>
          {member.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          年齢: {member.age}歳
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#ccc',
            mt: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {member.introduction || '紹介文なし'}
        </Typography>

        {member.originalImage && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              元画像: {member.originalImage.split('/').pop()}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit(member)}
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
          fullWidth
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(member.id)}
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
    </Card>
  )
}

export default AdminMemberCard
