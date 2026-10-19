import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import {
  getAllEntrepreneurships,
  getEntrepreneurshipCategories,
  getEntrepreneurshipsForUser,
} from '../../../app/container'
import { APP_BAR_HEIGHT } from '../../../app/theme/appTheme'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import { AccountDrawer } from './components/AccountDrawer'
import { CategoryFilter } from './components/CategoryFilter'
import { EntrepreneurshipCard } from './components/EntrepreneurshipCard'
import { HomeHeader } from './components/HomeHeader'
import { WelcomeSection } from './components/WelcomeSection'

export function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const session = useAuthStore((state) => state.session)
  const logout = useAuthStore((state) => state.logout)
  const userId = session?.user.id

  const ownedCount = useMemo(
    () => (userId ? getEntrepreneurshipsForUser.execute(userId).length : 0),
    [userId],
  )
  const categories = useMemo(() => getEntrepreneurshipCategories.execute(), [])
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )
  const visibleEntrepreneurships = useMemo(
    () =>
      getAllEntrepreneurships
        .execute()
        .filter(
          (entrepreneurship) =>
            categoryById.has(entrepreneurship.categoryId) &&
            (selectedCategoryIds.length === 0 || selectedCategoryIds.includes(entrepreneurship.categoryId)),
        ),
    [categoryById, selectedCategoryIds],
  )

  if (!session) {
    return null
  }

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <HomeHeader onOpenMenu={() => setIsMenuOpen(true)} />
      <AccountDrawer
        open={isMenuOpen}
        user={session.user}
        onClose={() => setIsMenuOpen(false)}
        onLogout={logout}
      />

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
          <WelcomeSection user={session.user} ownedCount={ownedCount} />

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
                <Typography color="text.secondary">Aún no hay emprendimientos en esta categoría.</Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))',
                    lg: 'repeat(4, minmax(0, 1fr))',
                  },
                  gap: { xs: 1.5, sm: 2.5 },
                }}
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
    </Box>
  )
}
