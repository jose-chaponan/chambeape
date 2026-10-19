import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { ResolvedUser } from '../../../users/domain/UserProfile'

interface WelcomeSectionProps {
  user: ResolvedUser
  ownedCount: number
}

function describeOwnedCount(count: number): string {
  if (count === 0) {
    return 'Aún no tienes emprendimientos publicados'
  }
  const plural = count === 1 ? '' : 's'
  return `Tienes ${count} emprendimiento${plural} publicado${plural}`
}

export function WelcomeSection({ user, ownedCount }: Readonly<WelcomeSectionProps>) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.25fr) minmax(280px, 0.75fr)' },
        gap: { xs: 3, md: 5 },
      }}
    >
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Chip label="Te damos la bienvenida a Chambea Pe" color="primary" sx={{ mb: 2, fontWeight: 800 }} />
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '2.35rem', sm: '3.7rem' }, mb: 2, overflowWrap: 'anywhere' }}
          >
            Hola, {user.firstNames}.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' }, maxWidth: 650 }}>
            Descubre lo que hacen los emprendedores de Lima y muestra lo tuyo al Perú desde tu propia vitrina.
          </Typography>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: 1,
          borderColor: 'divider',
          p: { xs: 3, sm: 4 },
          background: 'linear-gradient(145deg, #ffffff 0%, #fff1f7 100%)',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 3,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            mb: 3,
          }}
        >
          <StorefrontRoundedIcon fontSize="large" />
        </Box>
        <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>
          {describeOwnedCount(ownedCount)}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {ownedCount === 0
            ? 'Crea tu vitrina con tu historia, fotografías y redes sociales para que te encuentren.'
            : 'Mantén tu vitrina al día: actualiza tus productos, fotos y datos de contacto cuando quieras.'}
        </Typography>
        <Button
          component={RouterLink}
          to={ownedCount === 0 ? '/mi-emprendimiento/nuevo' : '/mi-emprendimiento'}
          variant="contained"
          sx={{ alignSelf: 'flex-start' }}
        >
          {ownedCount === 0 ? 'Crear mi emprendimiento' : 'Ir a mi emprendimiento'}
        </Button>
      </Paper>
    </Box>
  )
}
