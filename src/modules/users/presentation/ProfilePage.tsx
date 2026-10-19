import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AppBreadcrumbs } from '../../entrepreneurships/presentation/components/AppBreadcrumbs'
import { PageShell } from '../../entrepreneurships/presentation/components/PageShell'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import { getUserDisplayName } from '../application/getUserDisplayName'
import {
  GENDER_OPTIONS,
  toProfile,
  validateUserProfile,
  type ResolvedUser,
  type UserProfile,
  type UserProfileErrors,
} from '../domain/UserProfile'
import { fileToAvatarDataUrl } from '../infrastructure/avatarImage'
import { useCurrentUser } from '../state/useCurrentUser'
import { useProfileStore } from '../state/useProfileStore'

type Feedback = { severity: 'success' | 'error'; message: string }

function ProfileContent({ user }: Readonly<{ user: ResolvedUser }>) {
  const saveProfile = useProfileStore((state) => state.saveProfile)
  const logout = useAuthStore((state) => state.logout)
  const saved = toProfile(user)
  const [draft, setDraft] = useState<UserProfile>(saved)
  const [errors, setErrors] = useState<UserProfileErrors>({})
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const hasChanges = (Object.keys(saved) as (keyof UserProfile)[]).some(
    (field) => field !== 'avatarUrl' && draft[field] !== saved[field],
  )
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  const setField = (field: keyof UserProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = validateUserProfile(draft)
    if (!result.success) {
      setErrors(result.errors)
      return
    }
    // La foto se guarda al elegirla, así que aquí siempre se conserva la ya guardada.
    saveProfile(user.id, { ...result.data, avatarUrl: saved.avatarUrl })
    setDraft({ ...result.data, avatarUrl: saved.avatarUrl })
    setFeedback({ severity: 'success', message: 'Tus datos se actualizaron.' })
  }

  const handleDiscard = () => {
    setDraft(saved)
    setErrors({})
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const result = await fileToAvatarDataUrl(file)
    if (!result.ok) {
      setFeedback({ severity: 'error', message: result.message })
      return
    }
    saveProfile(user.id, { ...saved, avatarUrl: result.dataUrl })
    setFeedback({ severity: 'success', message: 'Foto de perfil actualizada.' })
  }

  const handleAvatarRemove = () => {
    saveProfile(user.id, { ...saved, avatarUrl: '' })
    setFeedback({ severity: 'success', message: 'Quitamos tu foto de perfil.' })
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <AppBreadcrumbs items={[{ label: 'Perfil' }]} />
        <Typography component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.75rem' }, mb: 3 }}>
          Perfil
        </Typography>

        <Stack spacing={3}>
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: { xs: 2.5, sm: 4 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: { sm: 'center' } }}>
              <Avatar
                src={user.avatarUrl || undefined}
                alt={user.avatarUrl ? `Foto de perfil de ${getUserDisplayName(user)}` : ''}
                sx={{ width: 96, height: 96, fontSize: '2.4rem', bgcolor: 'primary.main' }}
              >
                {user.firstNames.charAt(0)}
              </Avatar>
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography component="h2" variant="h6" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                  {getUserDisplayName(user)}
                </Typography>
                <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                  {user.email}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
                  <Button component="label" variant="outlined" startIcon={<AddAPhotoRoundedIcon />}>
                    {user.avatarUrl ? 'Cambiar foto' : 'Subir foto'}
                    <input
                      hidden
                      accept="image/jpeg,image/png,image/webp"
                      aria-label="Elegir foto de perfil"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                  </Button>
                  {user.avatarUrl && (
                    <Button color="inherit" startIcon={<DeleteOutlineRoundedIcon />} onClick={handleAvatarRemove}>
                      Quitar foto
                    </Button>
                  )}
                </Stack>
                <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mt: 1 }}>
                  JPG, PNG o WebP de hasta 5 MB. Se recorta en cuadrado.
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            component="form"
            noValidate
            aria-labelledby="datos-heading"
            elevation={0}
            onSubmit={handleSubmit}
            sx={{ border: 1, borderColor: 'divider', p: { xs: 2.5, sm: 4 } }}
          >
            <Typography component="h2" id="datos-heading" variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              Mis datos
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
              Tus cambios se guardan en este dispositivo.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
              <TextField
                required
                label="Nombres"
                autoComplete="given-name"
                value={draft.firstNames}
                onChange={(event) => setField('firstNames', event.target.value)}
                error={Boolean(errors.firstNames)}
                helperText={errors.firstNames}
              />
              <TextField
                required
                label="Apellidos"
                autoComplete="family-name"
                value={draft.lastNames}
                onChange={(event) => setField('lastNames', event.target.value)}
                error={Boolean(errors.lastNames)}
                helperText={errors.lastNames}
              />
              <TextField
                disabled
                label="Correo electrónico"
                value={user.email}
                helperText="El correo no se puede modificar."
                sx={{ gridColumn: { sm: '1 / -1' } }}
              />
              <TextField
                label="Celular"
                type="tel"
                autoComplete="tel-national"
                value={draft.phone}
                onChange={(event) => setField('phone', event.target.value.replaceAll(/\D/g, '').slice(0, 9))}
                error={Boolean(errors.phone)}
                helperText={errors.phone ?? 'Opcional. 9 dígitos.'}
                slotProps={{
                  input: { startAdornment: <InputAdornment position="start">+51</InputAdornment> },
                  htmlInput: { inputMode: 'numeric' },
                }}
              />
              <TextField
                select
                label="Sexo"
                value={draft.gender}
                onChange={(event) => setField('gender', event.target.value)}
                error={Boolean(errors.gender)}
                helperText={errors.gender ?? 'Opcional.'}
                slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
              >
                <MenuItem value="">Sin especificar</MenuItem>
                {GENDER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Fecha de nacimiento"
                type="date"
                autoComplete="bday"
                value={draft.birthDate}
                onChange={(event) => setField('birthDate', event.target.value)}
                error={Boolean(errors.birthDate)}
                helperText={errors.birthDate ?? 'Opcional.'}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: '1900-01-01', max: today } }}
              />
            </Box>

            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5} sx={{ mt: 4, justifyContent: 'flex-end' }}>
              <Button color="inherit" disabled={!hasChanges} onClick={handleDiscard}>
                Descartar cambios
              </Button>
              <Button type="submit" variant="contained" disabled={!hasChanges}>
                Guardar cambios
              </Button>
            </Stack>
          </Paper>

          <Button
            color="error"
            variant="outlined"
            startIcon={<LogoutRoundedIcon />}
            onClick={logout}
            sx={{ alignSelf: { sm: 'flex-start' } }}
          >
            Cerrar sesión
          </Button>
        </Stack>
      </Container>

      <Snackbar
        open={feedback !== null}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setFeedback(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} variant="filled" onClose={() => setFeedback(null)}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  )
}

export function ProfilePage() {
  const user = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <PageShell>
      <ProfileContent user={user} />
    </PageShell>
  )
}
