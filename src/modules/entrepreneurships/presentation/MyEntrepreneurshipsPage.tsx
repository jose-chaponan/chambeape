import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { getEntrepreneurshipCategories } from '../../../app/container'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import { useEntrepreneurships } from '../state/useEntrepreneurships'
import { AppBreadcrumbs } from './components/AppBreadcrumbs'
import { EntrepreneurshipCard } from './components/EntrepreneurshipCard'
import { PageShell } from './components/PageShell'

const NEW_PATH = '/mi-emprendimiento/nuevo'

export function MyEntrepreneurshipsPage() {
  const userId = useAuthStore((state) => state.session?.user.id)
  const categories = useMemo(() => getEntrepreneurshipCategories.execute(), [])
  const catalog = useEntrepreneurships()
  const owned = useMemo(
    () => catalog.filter((entrepreneurship) => entrepreneurship.ownerUserId === userId),
    [catalog, userId],
  )

  return (
    <PageShell>
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <AppBreadcrumbs items={[{ label: 'Mi emprendimiento' }]} />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 4 }}
          >
            <Box>
              <Typography component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.75rem' }, mb: 1 }}>
                Mi emprendimiento
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: '55ch' }}>
                {owned.length === 0
                  ? 'Aquí verás tus vitrinas cuando las publiques.'
                  : owned.length === 1
                    ? 'Tu vitrina publicada en Chambea Pe.'
                    : `Tus ${owned.length} vitrinas publicadas en Chambea Pe.`}
              </Typography>
            </Box>
            {owned.length > 0 && (
              <Button
                component={RouterLink}
                to={NEW_PATH}
                variant="contained"
                startIcon={<AddRoundedIcon />}
                sx={{ flexShrink: 0 }}
              >
                Crear emprendimiento
              </Button>
            )}
          </Stack>

          {owned.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ border: 1, borderStyle: 'dashed', borderColor: 'divider', p: { xs: 3, sm: 5 }, textAlign: 'center' }}
            >
              <StorefrontRoundedIcon aria-hidden="true" sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
                Aún no tienes emprendimientos publicados
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Crea tu vitrina con tu historia, fotografías y redes sociales para que te encuentren.
              </Typography>
              <Button component={RouterLink} to={NEW_PATH} variant="contained" startIcon={<AddRoundedIcon />}>
                Crear mi emprendimiento
              </Button>
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
                gridAutoRows: '1fr',
                gap: { xs: 1.5, sm: 2.5 },
              }}
            >
              {owned.map((entrepreneurship) => {
                const category = categories.find((item) => item.id === entrepreneurship.categoryId)
                return category ? (
                  <Stack key={entrepreneurship.id} spacing={1} sx={{ minHeight: 0 }}>
                    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                      <EntrepreneurshipCard
                        entrepreneurship={entrepreneurship}
                        category={category}
                        linkState={{ from: 'mine' }}
                      />
                    </Box>
                    <Button
                      component={RouterLink}
                      to={`/mi-emprendimiento/${entrepreneurship.id}/editar`}
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<EditRoundedIcon />}
                      aria-label={`Editar ${entrepreneurship.businessName}`}
                    >
                      Editar
                    </Button>
                  </Stack>
                ) : null
              })}
            </Box>
          )}
        </Container>
      </Box>
    </PageShell>
  )
}
