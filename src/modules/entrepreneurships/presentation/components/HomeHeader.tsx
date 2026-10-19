import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { AppBar, Chip, Container, IconButton, Stack, Toolbar } from '@mui/material'
import { APP_BAR_HEIGHT } from '../../../../app/theme/appTheme'
import { BrandLogo } from '../../../../shared/components/BrandLogo'

interface HomeHeaderProps {
  onOpenMenu: () => void
}

export function HomeHeader({ onOpenMenu }: Readonly<HomeHeaderProps>) {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(14px)',
        bgcolor: 'rgba(255, 255, 255, 0.88)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ justifyContent: 'space-between', minHeight: { xs: APP_BAR_HEIGHT.xs, sm: APP_BAR_HEIGHT.sm } }}
        >
          <BrandLogo compact />
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }} sx={{ alignItems: 'center' }}>
            <Chip
              color="secondary"
              icon={<VerifiedRoundedIcon />}
              label="Tu vitrina"
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 800 }}
            />
            <IconButton
              aria-label="Abrir menú"
              color="inherit"
              onClick={onOpenMenu}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
