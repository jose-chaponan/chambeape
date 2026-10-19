import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import {
  getAllEntrepreneurships,
  getEntrepreneurshipCategories,
  getEntrepreneurshipsForUser,
} from '../../../app/container'
import { APP_BAR_HEIGHT } from '../../../app/theme/appTheme'
import { useCurrentUser } from '../../users/state/useCurrentUser'
import {
  getEntrepreneurshipDistricts,
  searchEntrepreneurships,
} from '../application/SearchEntrepreneurships'
import { CatalogSearch } from './components/CatalogSearch'
import { CategoryFilter } from './components/CategoryFilter'
import { EntrepreneurshipCard } from './components/EntrepreneurshipCard'
import { PageShell } from './components/PageShell'
import { WelcomeSection } from './components/WelcomeSection'

export function HomePage() {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const currentUser = useCurrentUser()
  const userId = currentUser?.id

  const ownedCount = useMemo(
    () => (userId ? getEntrepreneurshipsForUser.execute(userId).length : 0),
    [userId],
  )
  const categories = useMemo(() => getEntrepreneurshipCategories.execute(), [])
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )
  const allEntrepreneurships = useMemo(
    () => getAllEntrepreneurships.execute().filter((entrepreneurship) => categoryById.has(entrepreneurship.categoryId)),
    [categoryById],
  )
  const districts = useMemo(() => getEntrepreneurshipDistricts(allEntrepreneurships), [allEntrepreneurships])
  const visibleEntrepreneurships = useMemo(
    () =>
      searchEntrepreneurships(allEntrepreneurships, {
        query: searchQuery,
        district: selectedDistrict,
        categoryIds: selectedCategoryIds,
      }),
    [allEntrepreneurships, searchQuery, selectedDistrict, selectedCategoryIds],
  )

  if (!currentUser) {
    return null
  }

  return (
    <PageShell>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 4, sm: 7, md: 10 },
          background:
            'radial-gradient(circle at 100% 0%, rgba(198, 247, 42, 0.28), transparent 24rem), radial-gradient(circle at 2% 100%, rgba(246, 5, 99, 0.12), transparent 28rem)',
        }}
      >
        <Container maxWidth="lg">
          <WelcomeSection user={currentUser} ownedCount={ownedCount} />

          <Box
            component="section"
            aria-labelledby="entrepreneurships-heading"
            sx={{ mt: { xs: 6, md: 10 }, scrollMarginTop: { xs: APP_BAR_HEIGHT.xs, sm: APP_BAR_HEIGHT.sm } }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 3 }}
            >
              <Box>
                <Chip
                  color="primary"
                  icon={<StorefrontRoundedIcon />}
                  label="Vitrina local"
                  size="small"
                  sx={{ mb: 1.5, fontWeight: 800 }}
                />
                <Typography component="h2" id="entrepreneurships-heading" variant="h4" sx={{ fontWeight: 800 }}>
                  Emprendimientos peruanos
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Descubre marcas locales y encuentra algo hecho con dedicación.
                </Typography>
              </Box>
              <Typography color="text.secondary" variant="body2" aria-live="polite" sx={{ flexShrink: 0 }}>
                {visibleEntrepreneurships.length} emprendimientos
              </Typography>
            </Stack>

            <CatalogSearch
              query={searchQuery}
              district={selectedDistrict}
              districts={districts}
              onQueryChange={setSearchQuery}
              onDistrictChange={setSelectedDistrict}
            />

            <CategoryFilter
              categories={categories}
              selectedIds={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
            />

            {visibleEntrepreneurships.length === 0 ? (
              <Paper
                elevation={0}
                sx={{ border: 1, borderStyle: 'dashed', borderColor: 'divider', p: 4, textAlign: 'center' }}
              >
                <Typography color="text.secondary">No encontramos emprendimientos con esa búsqueda. Prueba con otro producto, distrito o categoría.</Typography>
              </Paper>
            ) : (
              <Box
                sx={(theme) => ({
                  display: 'grid',
                  // Móvil: filas de igual altura. Escritorio: bento con tarjetas destacadas de 2x2.
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gridAutoRows: '1fr',
                  gap: { xs: 1.5, sm: 2.5 },
                  // Anchos explícitos: con 1fr, las tarjetas de 2 columnas desbalancean las pistas.
                  // (Las media queries van solo aquí: mezclarlas con valores responsivos las pisa.)
                  [theme.breakpoints.only('md')]: {
                    gridTemplateColumns: 'repeat(3, calc((100% - 2 * 20px) / 3))',
                    gridAutoRows: 'auto',
                    gridAutoFlow: 'row dense',
                    '& > :nth-of-type(8n + 1)': { gridColumn: 'span 2', gridRow: 'span 2' },
                    '& > :nth-of-type(8n + 6)': { gridColumn: '2 / span 2', gridRow: 'span 2' },
                  },
                  [theme.breakpoints.up('lg')]: {
                    gridTemplateColumns: 'repeat(4, calc((100% - 3 * 20px) / 4))',
                    gridAutoRows: 'auto',
                    gridAutoFlow: 'row dense',
                    '& > :nth-of-type(10n + 1)': { gridColumn: 'span 2', gridRow: 'span 2' },
                    '& > :nth-of-type(10n + 7)': { gridColumn: '3 / span 2', gridRow: 'span 2' },
                  },
                })}
              >
                {visibleEntrepreneurships.map((entrepreneurship) => (
                  <EntrepreneurshipCard
                    key={entrepreneurship.id}
                    entrepreneurship={entrepreneurship}
                    category={categoryById.get(entrepreneurship.categoryId)!}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Typography align="center" color="text.secondary" sx={{ mt: { xs: 6, md: 9 } }} variant="body2">
            Chambea Pe · La vitrina de los emprendimientos peruanos
          </Typography>
        </Container>
      </Box>
    </PageShell>
  )
}
