import ImageNotSupportedRoundedIcon from '@mui/icons-material/ImageNotSupportedRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { Entrepreneurship } from '../../domain/Entrepreneurship'
import type { EntrepreneurshipCategory } from '../../domain/EntrepreneurshipCategory'
import { categoryIcons } from './categoryIcons'

interface EntrepreneurshipCardProps {
  entrepreneurship: Entrepreneurship
  category: EntrepreneurshipCategory
}

export function EntrepreneurshipCard({ entrepreneurship, category }: Readonly<EntrepreneurshipCardProps>) {
  const { businessName, coverImageUrl, rating, shortDescription } = entrepreneurship

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 28px rgba(40, 19, 35, 0.1)',
        },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '4 / 3' }}>
        {coverImageUrl ? (
          <Box
            component="img"
            src={coverImageUrl}
            alt={`Portada de ${businessName}`}
            loading="lazy"
            decoding="async"
            sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            aria-label={`Imagen de ${businessName} próximamente`}
            role="img"
            sx={{
              width: '100%',
              height: '100%',
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
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.75, p: { xs: 1.25, sm: 2, lg: 2.5 } }}
      >
        <Chip
          color="secondary"
          icon={categoryIcons[category.icon]}
          label={category.name}
          size="small"
          sx={{ alignSelf: 'flex-start', maxWidth: '100%', fontSize: { xs: '0.68rem', sm: '0.75rem' }, fontWeight: 700 }}
        />
        <Typography
          component="h3"
          variant="h6"
          sx={{
            minWidth: 0,
            fontSize: { xs: '0.95rem', sm: '1.05rem', lg: '1.2rem' },
            fontWeight: 800,
            lineHeight: 1.25,
            overflowWrap: 'anywhere',
          }}
        >
          {businessName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.85rem', lg: '0.875rem' }, lineHeight: 1.4 }}
        >
          {shortDescription}
        </Typography>
      </CardContent>
    </Card>
  )
}
