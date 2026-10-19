import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import { APP_BAR_HEIGHT } from '../../../../app/theme/appTheme'
import type { SessionUser } from '../../../users/domain/User'
import { UserGreeting } from '../../../users/presentation/UserGreeting'

interface WelcomeSectionProps {
  user: SessionUser
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
          <Chip label="Bienvenida a Chambea Pe" color="primary" sx={{ mb: 2, fontWeight: 800 }} />
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '2.35rem', sm: '3.7rem' }, mb: 2, overflowWrap: 'anywhere' }}
          >
            Hola, {user.firstNames}.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' }, maxWidth: 650 }}>
            Estás a un paso de mostrar lo que haces al Perú. Este será tu espacio para darle visibilidad a tu emprendimiento.
          </Typography>
        </Box>
        <Paper
          id="mi-perfil"
          elevation={0}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderLeft: '5px solid',
            borderLeftColor: 'secondary.main',
            p: { xs: 2.5, sm: 3 },
            scrollMarginTop: { xs: APP_BAR_HEIGHT.xs + 16, sm: APP_BAR_HEIGHT.sm + 16 },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: 800 }}>Tu cuenta está lista</Typography>
          <UserGreeting user={user} />
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1, overflowWrap: 'anywhere' }}>
            {user.email}
          </Typography>
        </Paper>
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
          Próximamente podrás crear tu vitrina con tu historia, fotografías y redes sociales.
        </Typography>
        <Chip
          label="Creación de emprendimientos: próximamente"
          variant="outlined"
          sx={{
            alignSelf: 'flex-start',
            maxWidth: '100%',
            height: 'auto',
            fontWeight: 700,
            '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 },
          }}
        />
      </Paper>
    </Box>
  )
}
