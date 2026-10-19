import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import type { SessionUser } from '../../../users/domain/User'
import { getUserDisplayName } from '../../../users/application/getUserDisplayName'

interface AccountDrawerProps {
  open: boolean
  user: SessionUser
  onClose: () => void
  onLogout: () => void
}

export function AccountDrawer({ open, user, onClose, onLogout }: Readonly<AccountDrawerProps>) {
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: { xs: 'min(320px, 85vw)', sm: 360 }, p: 2 } } }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>Menú</Typography>
        <IconButton aria-label="Cerrar menú" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 1, py: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          {user.firstNames.charAt(0)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800 }} noWrap>{getUserDisplayName(user)}</Typography>
          <Typography color="text.secondary" variant="body2" noWrap>{user.email}</Typography>
        </Box>
      </Stack>
      <Divider />
      <List aria-label="Opciones de cuenta" sx={{ py: 1 }}>
        <ListItemButton component="a" href="#mi-perfil" onClick={onClose}>
          <ListItemIcon><AccountCircleRoundedIcon /></ListItemIcon>
          <ListItemText primary="Mi perfil" />
        </ListItemButton>
        <ListItemButton disabled>
          <ListItemIcon><SettingsRoundedIcon /></ListItemIcon>
          <ListItemText primary="Configuración" secondary="Próximamente" />
        </ListItemButton>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List sx={{ py: 1 }}>
        <ListItemButton onClick={onLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'inherit' }}><LogoutRoundedIcon /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}
