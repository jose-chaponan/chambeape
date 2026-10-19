import ImageNotSupportedRoundedIcon from '@mui/icons-material/ImageNotSupportedRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { Box, Card, CardContent, Chip, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { Entrepreneurship } from '../../domain/Entrepreneurship'
import type { EntrepreneurshipCategory } from '../../domain/EntrepreneurshipCategory'
import { categoryIcons } from './categoryIcons'
import { VerifiedBadge } from './VerifiedBadge'

interface EntrepreneurshipCardProps {
  entrepreneurship: Entrepreneurship
  category: EntrepreneurshipCategory
  /** Estado de navegación que recibe el detalle (p. ej. de qué lista venimos, para las migas de pan). */
  linkState?: unknown
}

export function EntrepreneurshipCard({ entrepreneurship, category, linkState }: Readonly<EntrepreneurshipCardProps>) {
  const { id, businessName, coverImageUrl, location, products, rating, shortDescription, verified } = entrepreneurship

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        height: '100%',
        // Evita que el texto de una tarjeta de 2 columnas (bento) ensanche las columnas del grid.
        contain: 'inline-size',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:has(a:focus-visible)': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 28px rgba(40, 19, 35, 0.1)',
        },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      {/* Proporción 4:3 con padding (no aspect-ratio) para que, al crecer en el bento, no ensanche las columnas. */}
      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          minHeight: 0,
          '&::before': { content: '""', display: 'block', paddingTop: '75%' },
        }}
      >
        {coverImageUrl ? (
          <Box
            component="img"
            src={coverImageUrl}
            alt={`Portada de ${businessName}`}
            loading="lazy"
            decoding="async"
            sx={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            aria-label={`Imagen de ${businessName} próximamente`}
            role="img"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeContent: 'center',
              justifyItems: 'center',
              gap: 1,
              bgcolor: 'action.hover',
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            <ImageNotSupportedRoundedIcon sx={{ fontSize: { xs: 30, sm: 38 }, opacity: 0.65 }} />
            <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
              Imagen próximamente
            </Typography>
          </Box>
        )}
        <Stack
          direction="row"
          spacing={0.25}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            alignItems: 'center',
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'rgba(255, 255, 255, 0.92)',
          }}
        >
          <StarRoundedIcon aria-hidden="true" sx={{ color: '#e5a900', fontSize: { xs: 16, sm: 18 } }} />
          <Typography
            aria-label={`Calificación: ${rating} de 5`}
            variant="body2"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, fontWeight: 800 }}
          >
            {rating.toFixed(1)}
          </Typography>
        </Stack>
      </Box>
      <CardContent
        sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0.75, p: { xs: 1.25, sm: 2, lg: 2.5 } }}
      >
        <Chip
          color="secondary"
          icon={categoryIcons[category.icon]}
          label={category.name}
          size="small"
          sx={{ alignSelf: 'flex-start', maxWidth: '100%', fontSize: { xs: '0.68rem', sm: '0.75rem' }, fontWeight: 700 }}
        />
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'flex-start' }}>
          <Typography
            component="h3"
            variant="h6"
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: { xs: '0.95rem', sm: '1.05rem', lg: '1.2rem' },
              fontWeight: 800,
              lineHeight: 1.25,
              minHeight: '2.5em',
              overflowWrap: 'anywhere',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            <Link
              component={RouterLink}
              to={`/emprendimientos/${id}`}
              state={linkState}
              color="inherit"
              underline="none"
              // La tarjeta entera es el área de clic; el enlace vive en el título para lectores de pantalla.
              sx={{ '&::after': { content: '""', position: 'absolute', inset: 0, zIndex: 1 }, '&:focus-visible': { outline: 'none' } }}
            >
              {businessName}
            </Link>
          </Typography>
          {verified && (
            // Misma tipografía y alto de línea que el título: el check queda centrado con su primera línea.
            // Va por encima del área de clic de la tarjeta para que el tooltip responda al cursor.
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                height: '1.25em',
                fontSize: { xs: '0.95rem', sm: '1.05rem', lg: '1.2rem' },
              }}
            >
              <VerifiedBadge size="1.15em" />
            </Box>
          )}
        </Stack>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', sm: '0.85rem', lg: '0.875rem' },
            lineHeight: 1.4,
            minHeight: '4.2em',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
          }}
        >
          {shortDescription}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontSize: { xs: '0.72rem', sm: '0.8rem' },
            lineHeight: 1.4,
            minHeight: '2.8em',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}
        >
          <Box component="span" sx={{ fontWeight: 800 }}>
            Ofrece:{' '}
          </Box>
          {products.join(' · ')}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary', minWidth: 0 }}>
          <PlaceRoundedIcon aria-hidden="true" sx={{ fontSize: { xs: 15, sm: 17 }, flexShrink: 0 }} />
          <Typography noWrap variant="body2" sx={{ fontSize: { xs: '0.72rem', sm: '0.8rem' } }}>
            {location.district}
            {location.province !== location.district ? `, ${location.province}` : ''}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
