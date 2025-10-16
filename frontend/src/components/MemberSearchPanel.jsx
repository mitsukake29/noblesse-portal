import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  OutlinedInput,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const DATING_TYPES = ['A', 'B1', 'B2', 'C', 'D']
const BUST_CUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const MemberSearchPanel = ({ onSearch, onReset }) => {
  const [searchParams, setSearchParams] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('memberSearchParams')
    return saved ? JSON.parse(saved) : {
      ageMin: '',
      ageMax: '',
      datingTypes: [],
      bustCups: [],
      freeword: ''
    }
  })

  useEffect(() => {
    // Save to localStorage whenever search params change
    localStorage.setItem('memberSearchParams', JSON.stringify(searchParams))
  }, [searchParams])

  const handleChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    onSearch(searchParams)
  }

  const handleReset = () => {
    const emptyParams = {
      ageMin: '',
      ageMax: '',
      datingTypes: [],
      bustCups: [],
      freeword: ''
    }
    setSearchParams(emptyParams)
    localStorage.removeItem('memberSearchParams')
    onReset()
  }

  const hasActiveFilters = () => {
    return searchParams.ageMin || searchParams.ageMax ||
           searchParams.datingTypes.length > 0 ||
           searchParams.bustCups.length > 0 ||
           searchParams.freeword
  }

  return (
    <Accordion
      defaultExpanded
      sx={{
        bgcolor: 'rgba(60, 60, 60, 0.9)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        mb: 3,
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#d4af37' }} />}
        sx={{
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          },
        }}
      >
        <SearchIcon sx={{ color: '#d4af37' }} />
        <Typography sx={{ color: '#d4af37', fontWeight: 600 }}>
          会員検索
        </Typography>
        {hasActiveFilters() && (
          <Chip
            label="フィルター適用中"
            size="small"
            sx={{
              bgcolor: '#d4af37',
              color: '#0a0a0a',
              fontWeight: 600,
            }}
          />
        )}
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Age Range */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="年齢（最小）"
                type="number"
                value={searchParams.ageMin}
                onChange={(e) => handleChange('ageMin', e.target.value)}
                inputProps={{ min: 18, max: 100 }}
              />
              <Typography sx={{ color: '#999' }}>〜</Typography>
              <TextField
                fullWidth
                label="年齢（最大）"
                type="number"
                value={searchParams.ageMax}
                onChange={(e) => handleChange('ageMax', e.target.value)}
                inputProps={{ min: 18, max: 100 }}
              />
            </Box>
          </Grid>

          {/* Dating Type */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>交際タイプ</InputLabel>
              <Select
                multiple
                value={searchParams.datingTypes}
                onChange={(e) => handleChange('datingTypes', e.target.value)}
                input={<OutlinedInput label="交際タイプ" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {DATING_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Bust Cup */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>バストカップ</InputLabel>
              <Select
                multiple
                value={searchParams.bustCups}
                onChange={(e) => handleChange('bustCups', e.target.value)}
                input={<OutlinedInput label="バストカップ" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {BUST_CUPS.map((cup) => (
                  <MenuItem key={cup} value={cup}>
                    {cup}カップ
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Freeword */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="フリーワード"
              value={searchParams.freeword}
              onChange={(e) => handleChange('freeword', e.target.value)}
              placeholder="名前、職業、趣味など"
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleReset}
                disabled={!hasActiveFilters()}
                sx={{
                  color: '#999',
                  borderColor: '#666',
                  '&:hover': {
                    borderColor: '#999',
                    bgcolor: 'rgba(153, 153, 153, 0.1)',
                  },
                }}
              >
                クリア
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  bgcolor: '#d4af37',
                  color: '#0a0a0a',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#f0c861',
                  },
                }}
              >
                検索
              </Button>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default MemberSearchPanel
