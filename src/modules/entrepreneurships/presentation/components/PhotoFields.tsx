import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { Box, Button, FormHelperText, IconButton, Stack, Typography } from '@mui/material'
import type { ChangeEvent } from 'react'
import { MAX_GALLERY_PHOTOS } from '../../domain/EntrepreneurshipForm'

const ACCEPT = 'image/jpeg,image/png,image/webp'

interface CoverFieldProps {
  value: string
  error?: string
  busy?: boolean
  onPick: (file: File) => void
  onRemove: () => void
}

/** Portada: una sola foto, con vista previa 4:3 como se ve en las tarjetas. */
export function CoverPhotoField({ value, error, busy, onPick, onRemove }: Readonly<CoverFieldProps>) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) onPick(file)
  }

  return (
    <Box data-invalid={error ? 'true' : undefined}>
      <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Foto de portada
      </Typography>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          borderRadius: 1,
          border: 1,
          borderStyle: value ? 'solid' : 'dashed',
          borderColor: error ? 'error.main' : 'divider',
          bgcolor: 'action.hover',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {value ? (
          <Box
            component="img"
            src={value}
            alt="Vista previa de la portada"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Stack spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary', p: 2, textAlign: 'center' }}>
            <AddAPhotoRoundedIcon aria-hidden="true" />
            <Typography variant="body2">Aún no hay portada</Typography>
          </Stack>
        )}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Button component="label" variant="outlined" startIcon={<AddAPhotoRoundedIcon />} disabled={busy}>
          {value ? 'Cambiar portada' : 'Subir portada'}
          <input hidden accept={ACCEPT} aria-label="Elegir foto de portada" type="file" onChange={handleChange} />
        </Button>
        {value && (
          <Button color="inherit" startIcon={<DeleteOutlineRoundedIcon />} onClick={onRemove}>
            Quitar
          </Button>
        )}
      </Stack>
      <FormHelperText error={Boolean(error)} sx={{ mx: 0 }}>
        {error ?? 'JPG, PNG o WebP. La reducimos para que se guarde en tu dispositivo.'}
      </FormHelperText>
    </Box>
  )
}

interface GalleryFieldProps {
  photos: string[]
  error?: string
  busy?: boolean
  onPick: (files: File[]) => void
  onRemove: (index: number) => void
}

/** Galería: hasta 5 fotos adicionales, cada una con su botón para quitarla. */
export function GalleryPhotosField({ photos, error, busy, onPick, onRemove }: Readonly<GalleryFieldProps>) {
  const isFull = photos.length >= MAX_GALLERY_PHOTOS

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length > 0) onPick(files)
  }

  return (
    <Box data-invalid={error ? 'true' : undefined}>
      <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Galería
      </Typography>
      {photos.length > 0 && (
        <Box
          component="ul"
          aria-label="Fotos de la galería"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' },
            gap: 1.5,
            m: 0,
            mb: 1.5,
            p: 0,
            listStyle: 'none',
          }}
        >
          {photos.map((photo, index) => (
            <Box
              component="li"
              key={photo.slice(-40) + index}
              sx={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: 1, border: 1, borderColor: 'divider' }}
            >
              <Box
                component="img"
                src={photo}
                alt={`Foto ${index + 1} de la galería`}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                aria-label={`Quitar foto ${index + 1}`}
                size="small"
                onClick={() => onRemove(index)}
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  color: '#fff',
                  bgcolor: 'rgba(40, 19, 35, 0.72)',
                  '&:hover': { bgcolor: 'rgba(40, 19, 35, 0.9)' },
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
      <Button component="label" variant="outlined" startIcon={<AddAPhotoRoundedIcon />} disabled={busy || isFull}>
        Agregar fotos
        <input hidden multiple accept={ACCEPT} aria-label="Elegir fotos de la galería" type="file" onChange={handleChange} />
      </Button>
      <FormHelperText error={Boolean(error)} sx={{ mx: 0 }}>
        {error ?? `Opcional. ${photos.length}/${MAX_GALLERY_PHOTOS} fotos.`}
      </FormHelperText>
    </Box>
  )
}
