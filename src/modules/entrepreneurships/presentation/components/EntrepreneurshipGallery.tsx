import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, ButtonBase, Dialog, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { PAGE_GUTTER } from '../../../../app/theme/appTheme'

interface EntrepreneurshipGalleryProps {
  name: string
  images: string[]
}

const MAX_MOSAIC_IMAGES = 5

// Mosaico de escritorio: la portada manda y el resto la acompaña según cuántas fotos haya.
function mosaicColumns(count: number): string {
  if (count === 1) return '1fr'
  if (count === 2) return '2fr 1fr'
  return '2fr 1fr 1fr'
}

function thumbPlacement(count: number, index: number): Record<string, string> {
  if (count <= 3) return { gridColumn: '2 / -1' }
  if (count === 4 && index === 2) return { gridColumn: '2 / -1' }
  return {}
}

const overlayButtonSx = { color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.14)' }

export function EntrepreneurshipGallery({ name, images }: Readonly<EntrepreneurshipGalleryProps>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const visible = images.slice(0, MAX_MOSAIC_IMAGES)
  const hiddenCount = images.length - visible.length

  const move = (step: number) =>
    setOpenIndex((current) => (current === null ? null : (current + step + images.length) % images.length))

  const photo = (index: number, overlay?: string) => (
    <ButtonBase
      aria-label={`Ver foto ${index + 1} de ${images.length} de ${name}`}
      onClick={() => setOpenIndex(index)}
      sx={{
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        borderRadius: 1,
        bgcolor: 'action.hover',
        '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        '& img': { transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)' },
        '&:hover img': { transform: 'scale(1.03)' },
        '@media (prefers-reduced-motion: reduce)': {
          '& img': { transition: 'none' },
          '&:hover img': { transform: 'none' },
        },
      }}
    >
      <Box
        component="img"
        src={images[index]}
        alt={index === 0 ? `Portada de ${name}` : `Foto ${index} de ${name}`}
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {overlay && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'rgba(40, 19, 35, 0.62)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.15rem',
          }}
        >
          {overlay}
        </Box>
      )}
    </ButtonBase>
  )

  return (
    <>
      {/* Móvil: tira horizontal con snap; la siguiente foto asoma para invitar a deslizar. */}
      <Box
        role="group"
        aria-label={`Fotos de ${name}`}
        sx={{
          display: { xs: 'flex', md: 'none' },
          gap: 1,
          mx: -PAGE_GUTTER,
          px: PAGE_GUTTER,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: (theme) => theme.spacing(PAGE_GUTTER),
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {images.map((src, index) => (
          <Box
            key={src}
            sx={{
              flex: '0 0 auto',
              width: images.length === 1 ? '100%' : { xs: '86%', sm: '62%' },
              scrollSnapAlign: 'start',
              display: 'grid',
              '& > button': { aspectRatio: '4 / 3', width: '100%' },
            }}
          >
            {photo(index)}
          </Box>
        ))}
      </Box>
      {images.length > 1 && (
        <Typography
          aria-hidden="true"
          color="text.secondary"
          variant="caption"
          sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}
        >
          {images.length} fotos · desliza para verlas
        </Typography>
      )}

      {/* Escritorio: mosaico. */}
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: mosaicColumns(visible.length),
          gridTemplateRows: visible.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
          gap: 1.5,
          height: { md: 420, lg: 500 },
        }}
      >
        <Box
          sx={{ display: 'grid', gridRow: visible.length === 1 ? 'auto' : 'span 2', '& > button': { height: '100%' } }}
        >
          {photo(0)}
        </Box>
        {visible.slice(1).map((src, i) => (
          <Box
            key={src}
            sx={{ display: 'grid', '& > button': { height: '100%' }, ...thumbPlacement(visible.length, i) }}
          >
            {photo(i + 1, i === visible.length - 2 && hiddenCount > 0 ? `+${hiddenCount} fotos` : undefined)}
          </Box>
        ))}
      </Box>

      <Dialog
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        fullScreen
        aria-label={`Galería de ${name}`}
        slotProps={{ paper: { sx: { bgcolor: 'rgba(24, 10, 20, 0.97)', color: '#fff' } } }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') move(1)
          if (event.key === 'ArrowLeft') move(-1)
        }}
      >
        <Box sx={{ position: 'relative', flexGrow: 1, display: 'grid', placeItems: 'center', p: { xs: 1, md: 6 } }}>
          {openIndex !== null && (
            <Box
              component="img"
              src={images[openIndex]}
              alt={`Foto ${openIndex + 1} de ${images.length} de ${name}`}
              sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 0.5 }}
            />
          )}
          <IconButton
            aria-label="Cerrar galería"
            onClick={() => setOpenIndex(null)}
            sx={{ ...overlayButtonSx, position: 'absolute', top: 12, right: 12 }}
          >
            <CloseRoundedIcon />
          </IconButton>
          {images.length > 1 && (
            <>
              <IconButton
                aria-label="Foto anterior"
                onClick={() => move(-1)}
                sx={{ ...overlayButtonSx, position: 'absolute', left: { xs: 6, md: 20 } }}
              >
                <ArrowBackIosNewRoundedIcon />
              </IconButton>
              <IconButton
                aria-label="Foto siguiente"
                onClick={() => move(1)}
                sx={{ ...overlayButtonSx, position: 'absolute', right: { xs: 6, md: 20 } }}
              >
                <ArrowForwardIosRoundedIcon />
              </IconButton>
            </>
          )}
          <Typography
            aria-live="polite"
            variant="body2"
            sx={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', opacity: 0.85 }}
          >
            {openIndex === null ? '' : `${openIndex + 1} / ${images.length}`}
          </Typography>
        </Box>
      </Dialog>
    </>
  )
}
