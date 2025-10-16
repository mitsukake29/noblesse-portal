import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CardActionArea,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const MemberCard = ({ member, onClick }) => {
  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: 'rgba(60, 60, 60, 0.9)',
        border: '2px solid rgba(212, 175, 55, 0.5)',
        borderRadius: '2px',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '2px',
          padding: '2px',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.4), rgba(100, 149, 237, 0.3), rgba(212, 175, 55, 0.2))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        },
        '&:hover': {
          borderColor: '#e5c158',
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 48px rgba(212, 175, 55, 0.5), 0 8px 32px rgba(100, 149, 237, 0.3), 0 0 0 1px rgba(229, 193, 88, 0.4)',
          bgcolor: 'rgba(70, 70, 70, 0.95)',
          '&::before': {
            opacity: 1,
          },
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        {member.image ? (
          <CardMedia
            component="img"
            image={member.image}
            alt={member.name}
            sx={{
              width: '100%',
              height: 450,
              objectFit: 'cover',
              objectPosition: 'center center',
              filter: 'brightness(0.95)',
            }}
          />
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
            <PersonIcon sx={{ fontSize: 80, color: '#888' }} />
          </Box>
        )}

        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
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
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, fontSize: '1.1rem' }}
          >
            {member.age}歳
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#aaa',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.8,
            }}
          >
            {member.introduction || '詳細はプロフィールをご覧ください'}
          </Typography>

          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                background: 'linear-gradient(90deg, #d4af37 0%, #6495ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              VIEW PROFILE →
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default MemberCard
