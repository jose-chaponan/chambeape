import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, type ReactElement } from 'react'
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import {
  getAllEntrepreneurships,
  getEntrepreneurshipById,
  getEntrepreneurshipCategories,
} from '../../../app/container'
import { APP_BAR_HEIGHT } from '../../../app/theme/appTheme'
import { getRelatedEntrepreneurships } from '../application/SearchEntrepreneurships'
import type { Entrepreneurship } from '../domain/Entrepreneurship'
import { AppBreadcrumbs, type BreadcrumbItem } from './components/AppBreadcrumbs'
import { categoryIcons } from './components/categoryIcons'
import { EntrepreneurshipCard } from './components/EntrepreneurshipCard'
import { EntrepreneurshipGallery } from './components/EntrepreneurshipGallery'
import { PageShell } from './components/PageShell'
import { VerifiedBadge } from './components/VerifiedBadge'

const SOCIAL_LINKS: { key: keyof Entrepreneurship['socialLinks']; label: string; icon: ReactElement }[] = [
  { key: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { key: 'facebook', label: 'Facebook', icon: <FacebookRoundedIcon /> },
  { key: 'tiktok', label: 'TikTok', icon: <MusicNoteRoundedIcon /> },
  { key: 'website', label: 'Sitio web', icon: <LanguageRoundedIcon /> },
]

function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <AppBreadcrumbs items={[{ label: 'No encontrado' }]} />
        <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
          No encontramos este emprendimiento
        </Typography>
        <Typography color="text.secondary">
          Puede que el enlace esté incompleto o que la vitrina ya no esté disponible. Vuelve al catálogo para
          descubrir otros emprendimientos peruanos.
        </Typography>
        <Button component={RouterLink} to="/home" variant="contained">
          Ir al catálogo
        </Button>
      </Stack>
    </Container>
  )
}

function SectionTitle({ children, id }: Readonly<{ children: string; id: string }>) {
  return (
    <Typography component="h2" id={id} variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
      {children}
    </Typography>
  )
}

export function EntrepreneurshipDetailPage() {
  const { entrepreneurshipId = '' } = useParams()
  const cameFromMine = (useLocation().state as { from?: string } | null)?.from === 'mine'
  const entrepreneurship = useMemo(
    () => getEntrepreneurshipById.execute(entrepreneurshipId),
    [entrepreneurshipId],
  )
  const categories = useMemo(() => getEntrepreneurshipCategories.execute(), [])
  const related = useMemo(
    () =>
      entrepreneurship
        ? getRelatedEntrepreneurships(getAllEntrepreneurships.execute(), entrepreneurship)
        : [],
    [entrepreneurship],
  )

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [entrepreneurshipId])

  useEffect(() => {
    if (!entrepreneurship) return undefined
    const previousTitle = document.title
    document.title = `${entrepreneurship.businessName} · Chambea Pe`
    return () => {
      document.title = previousTitle
    }
  }, [entrepreneurship])

  const category = categories.find((item) => item.id === entrepreneurship?.categoryId)

  if (!entrepreneurship || !category) {
    return (
      <PageShell>
        <NotFound />
      </PageShell>
    )
  }

  const { businessName, coverImageUrl, location, longDescription, photoUrls, products, rating, socialLinks, verified } =
    entrepreneurship
  const images = [coverImageUrl, ...photoUrls].filter((src): src is string => Boolean(src))
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${location.district}, ${location.province}, ${location.department}, Perú`,
  )}`
  const socials = SOCIAL_LINKS.filter((social) => socialLinks[social.key])
  const sectionOffset = { xs: APP_BAR_HEIGHT.xs + 16, sm: APP_BAR_HEIGHT.sm + 16 }
  const trail: BreadcrumbItem[] = [
    ...(cameFromMine ? [{ label: 'Mi emprendimiento', to: '/mi-emprendimiento' }] : []),
    { label: businessName },
  ]

  return (
    <PageShell>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 1, md: 2 },
          pb: { xs: 6, md: 10 },
          background:
            'radial-gradient(circle at 100% 0%, rgba(198, 247, 42, 0.22), transparent 24rem), radial-gradient(circle at 0% 100%, rgba(246, 5, 99, 0.08), transparent 28rem)',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={{ xs: 2, md: 3 }}>
            <AppBreadcrumbs items={trail} />

            {images.length > 0 ? (
              <Box>
                <EntrepreneurshipGallery name={businessName} images={images} />
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{ border: 1, borderStyle: 'dashed', borderColor: 'divider', p: 4, textAlign: 'center' }}
              >
                <Typography color="text.secondary">Este emprendimiento aún no tiene fotos.</Typography>
              </Paper>
            )}
          </Stack>

          <Box
            sx={{
              mt: { xs: 4, md: 6 },
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 340px' },
              gap: { xs: 5, md: 8 },
              alignItems: 'start',
            }}
          >
            <Stack spacing={{ xs: 5, md: 6 }}>
              <Box component="header">
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 2 }}>
                  <Chip
                    color="secondary"
                    icon={categoryIcons[category.icon]}
                    label={category.name}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                  <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
                    <StarRoundedIcon aria-hidden="true" sx={{ color: '#e5a900', fontSize: 20 }} />
                    <Typography aria-label={`Calificación: ${rating} de 5`} sx={{ fontWeight: 800 }}>
                      {rating.toFixed(1)}
                    </Typography>
                  </Stack>
                </Stack>
                {/* El check vive fuera del h1 (para no alterar su nombre) y se centra con el título. */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center', fontSize: { xs: '2.25rem', sm: '3rem', md: '3.6rem' } }}
                >
                  <Typography
                    component="h1"
                    sx={{ fontSize: 'inherit', lineHeight: 1.05, overflowWrap: 'anywhere', textWrap: 'balance' }}
                  >
                    {businessName}
                  </Typography>
                  {verified && <VerifiedBadge size="0.6em" />}
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 1.5, color: 'text.secondary' }}>
                  <PlaceRoundedIcon aria-hidden="true" fontSize="small" />
                  <Typography>
                    {location.district}, {location.department}
                  </Typography>
                </Stack>
              </Box>

              <Box component="section" aria-labelledby="sobre-heading">
                <SectionTitle id="sobre-heading">Su historia</SectionTitle>
                <Typography sx={{ maxWidth: '65ch', fontSize: { xs: '1.05rem', sm: '1.15rem' }, lineHeight: 1.65 }}>
                  {longDescription}
                </Typography>
              </Box>

              <Box component="section" aria-labelledby="productos-heading">
                <SectionTitle id="productos-heading">Lo que ofrecen</SectionTitle>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    p: 0,
                    listStyle: 'none',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                    columnGap: 4,
                  }}
                >
                  {products.map((product) => (
                    <Box
                      component="li"
                      key={product}
                      sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 1.5,
                        py: 1.5,
                        borderBottom: 1,
                        borderColor: 'divider',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                      }}
                    >
                      <Box
                        aria-hidden="true"
                        sx={{ width: 8, height: 8, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main' }}
                      />
                      {product}
                    </Box>
                  ))}
                </Box>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 1.5 }}>
                  Algunos de sus productos y servicios, a modo de ejemplo.
                </Typography>
              </Box>
            </Stack>

            <Box
              component="aside"
              aria-labelledby="ubicacion-heading"
              sx={{
                position: { md: 'sticky' },
                top: { md: APP_BAR_HEIGHT.sm + 24 },
                scrollMarginTop: sectionOffset,
              }}
            >
              <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: { xs: 2.5, sm: 3 } }}>
                <Typography component="h2" id="ubicacion-heading" variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Dónde encontrarlos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {location.district}
                </Typography>
                <Typography color="text.secondary">
                  {location.province === location.department
                    ? location.department
                    : `${location.province}, ${location.department}`}
                </Typography>
                <Button
                  component="a"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  endIcon={<OpenInNewRoundedIcon />}
                  fullWidth
                  sx={{ mt: 2.5 }}
                >
                  Ver zona en el mapa
                </Button>
                {socials.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                      Sus redes
                    </Typography>
                    <Stack spacing={1}>
                      {socials.map((social) => (
                        <Button
                          key={social.key}
                          component="a"
                          href={socialLinks[social.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          color="inherit"
                          startIcon={social.icon}
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          {social.label}
                        </Button>
                      ))}
                    </Stack>
                  </>
                )}
              </Paper>
            </Box>
          </Box>

          {related.length > 0 && (
            <Box component="section" aria-labelledby="relacionados-heading" sx={{ mt: { xs: 7, md: 10 } }}>
              <SectionTitle id="relacionados-heading">También te puede interesar</SectionTitle>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
                  gridAutoRows: '1fr',
                  gap: { xs: 1.5, sm: 2.5 },
                }}
              >
                {related.map((item) => (
                  <EntrepreneurshipCard
                    key={item.id}
                    entrepreneurship={item}
                    category={categories.find((c) => c.id === item.categoryId)!}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </PageShell>
  )
}
