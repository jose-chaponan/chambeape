import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, InputAdornment, MenuItem, TextField } from '@mui/material'

interface CatalogSearchProps {
  query: string
  district: string
  districts: string[]
  onQueryChange: (query: string) => void
  onDistrictChange: (district: string) => void
}

export function CatalogSearch({
  query,
  district,
  districts,
  onQueryChange,
  onDistrictChange,
}: Readonly<CatalogSearchProps>) {
  return (
    <Box
      component="form"
      role="search"
      aria-label="Buscar emprendimientos"
      onSubmit={(event) => event.preventDefault()}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 2fr) minmax(0, 1fr)' },
        gap: 1.5,
        mb: 2.5,
      }}
    >
      <TextField
        type="search"
        size="small"
        label="Buscar producto o servicio"
        placeholder="Ej. pachamanca, velas, blazer"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon aria-hidden="true" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
      />
      <TextField
        select
        size="small"
        label="Distrito"
        value={district}
        onChange={(event) => onDistrictChange(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PlaceRoundedIcon aria-hidden="true" />
              </InputAdornment>
            ),
          },
          select: { displayEmpty: true },
          inputLabel: { shrink: true },
        }}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
      >
        <MenuItem value="">Todos los distritos</MenuItem>
        {districts.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}
