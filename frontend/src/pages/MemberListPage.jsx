import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material'
import MemberCard from '../components/MemberCard'
import MemberSearchPanel from '../components/MemberSearchPanel'

const MemberListPage = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchMembers()
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
      const url = queryString ? `/api/members?${queryString}` : '/api/members'

      const response = await axios.get(url)
      setMembers(response.data)
      setError('')
    } catch (err) {
      setError('会員情報の取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchParams) => {
    fetchMembers(searchParams)
  }

  const handleReset = () => {
    fetchMembers()
  }

  const handleMemberClick = (memberId) => {
    navigate(`/portal/members/${memberId}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#d4af37' }} />
      </Box>
    )
  }

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
        Distinguished Ladies
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        厳選された女性会員のご紹介
      </Typography>

      <MemberSearchPanel onSearch={handleSearch} onReset={handleReset} />

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {members.length === 0 && !loading ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            bgcolor: '#1a1a1a',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            現在、登録されている会員はおりません
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {members.map((member) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
              <MemberCard member={member} onClick={() => handleMemberClick(member.id)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default MemberListPage
