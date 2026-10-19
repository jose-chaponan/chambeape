import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import { APP_BAR_HEIGHT } from '../../../../app/theme/appTheme'
import type { EntrepreneurshipCategory } from '../../domain/EntrepreneurshipCategory'
import { categoryIcons } from './categoryIcons'

interface CategoryFilterProps {
  categories: EntrepreneurshipCategory[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
}

export function CategoryFilter({ categories, selectedIds, onChange }: Readonly<CategoryFilterProps>) {
  const hasSelection = selectedIds.length > 0

  const toggleCategory = (categoryId: string) => {
    onChange(
      selectedIds.includes(categoryId)
        ? selectedIds.filter((id) => id !== categoryId)
        : [...selectedIds, categoryId],
    )
  }

  return (
    <Box
      sx={{
        // Bajo md el filtro queda fijo bajo la barra superior; en escritorio fluye con la página.
        position: { xs: 'sticky', md: 'static' },
        top: { xs: APP_BAR_HEIGHT.xs, sm: APP_BAR_HEIGHT.sm, md: 'auto' },
        zIndex: (theme) => theme.zIndex.appBar - 1,
        mx: { xs: -2, sm: -3, md: 0 },
        px: { xs: 2, sm: 3, md: 0 },
        py: { xs: 1.5, md: 0 },
        mb: 3,
        bgcolor: { xs: 'rgba(255, 249, 252, 0.96)', md: 'transparent' },
        backdropFilter: { xs: 'blur(12px)', md: 'none' },
        borderBottom: { xs: 1, md: 0 },
        borderColor: 'divider',
      }}
    >
      <FormControl fullWidth size="small" sx={{ display: { xs: 'flex', md: 'none' } }}>
        <InputLabel id="mobile-category-filter-label">Filtrar categorías</InputLabel>
        <Select
          labelId="mobile-category-filter-label"
          id="mobile-category-filter"
          multiple
          value={selectedIds}
          label="Filtrar categorías"
          onChange={(event) => {
            const value = event.target.value
            onChange(typeof value === 'string' ? value.split(',') : value)
          }}
          renderValue={(selected) =>
            selected.length === 0
              ? 'Todas las categorías'
              : `${selected.length} categoría${selected.length === 1 ? '' : 's'}`
          }
          sx={{ bgcolor: 'background.paper' }}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              <Checkbox checked={selectedIds.includes(category.id)} />
              <ListItemIcon>{categoryIcons[category.icon]}</ListItemIcon>
              <ListItemText primary={category.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack
        direction="row"
        role="group"
        aria-label="Filtrar por categoría"
        sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1 }}
      >
        <Chip
          clickable
          aria-pressed={!hasSelection}
          color={hasSelection ? 'default' : 'primary'}
          label="Todas"
          onClick={() => onChange([])}
          variant={hasSelection ? 'outlined' : 'filled'}
        />
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category.id)

          return (
            <Chip
              key={category.id}
              clickable
              aria-pressed={isSelected}
              color={isSelected ? 'primary' : 'default'}
              icon={categoryIcons[category.icon]}
              label={category.name}
              onClick={() => toggleCategory(category.id)}
              variant={isSelected ? 'filled' : 'outlined'}
            />
          )
        })}
      </Stack>
    </Box>
  )
}
