import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Container, Paper, Typography } from '@mui/material'
import { useMemo } from 'react'
import { getEntrepreneurshipCategories, getEntrepreneurshipsForUser } from '../../../app/container'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import { AppBreadcrumbs } from './components/AppBreadcrumbs'
import { EntrepreneurshipCard } from './components/EntrepreneurshipCard'
import { PageShell } from './components/PageShell'

export function MyEntrepreneurshipsPage() {
  const userId = useAuthStore((state) => state.session?.user.id)
  const categories = useMemo(() => getEntrepreneurshipCategories.execute(), [])
  const owned = useMemo(() => (userId ? getEntrepreneurshipsForUser.execute(userId) : []), [userId])

  return (
    <PageShell>
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <AppBreadcrumbs items={[{ label: 'Mi emprendimiento' }]} />
          <Typography component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.75rem' }, mb: 1 }}>
            Mi emprendimiento
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '55ch' }}>
            {owned.length === 0
              ? 'Aquí verás tus vitrinas cuando las publiques.'
              : `Tus vitrinas publicadas en Chambea Pe (${owned.length}).`}
          </Typography>

          {owned.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ border: 1, borderStyle: 'dashed', borderColor: 'divider', p: { xs: 3, sm: 5 }, textAlign: 'center' }}
            >
              <StorefrontRoundedIcon aria-hidden="true" sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
                Aún no tienes emprendimientos publicados
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Próximamente podrás crear tu vitrina con tu historia, fotografías y redes sociales.
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
                gridAutoRows: '1fr',
                gap: { xs: 1.5, sm: 2.5 },
              }}
            >
              {owned.map((entrepreneurship) => {
                const category = categories.find((item) => item.id === entrepreneurship.categoryId)
                return category ? (
                  <EntrepreneurshipCard
                    key={entrepreneurship.id}
                    entrepreneurship={entrepreneurship}
                    category={category}
                    linkState={{ from: 'mine' }}
                  />
                ) : null
              })}
            </Box>
          )}
        </Container>
      </Box>
    </PageShell>
  )
}
