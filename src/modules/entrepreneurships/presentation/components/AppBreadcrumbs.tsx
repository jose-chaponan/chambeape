import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  /** Sin `to`, el elemento es la página actual. */
  to?: string
  state?: unknown
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[]
}

/** Ruta de navegación de las pantallas internas: siempre parte de Inicio y termina en la página actual. */
export function AppBreadcrumbs({ items }: Readonly<AppBreadcrumbsProps>) {
  const trail: BreadcrumbItem[] = [{ label: 'Inicio', to: '/home' }, ...items]

  return (
    <Breadcrumbs
      aria-label="Ruta de navegación"
      separator={<ChevronRightRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} />}
      sx={{
        mb: { xs: 2, md: 3 },
        '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' },
        '& .MuiBreadcrumbs-li': { minWidth: 0 },
        '& .MuiBreadcrumbs-separator': { mx: 0.5, color: 'text.secondary', flexShrink: 0 },
      }}
    >
      {trail.map((item, index) =>
        item.to ? (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            state={item.state}
            color="text.secondary"
            underline="hover"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              minHeight: 32,
              flexShrink: 0,
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {index === 0 && <HomeRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} />}
            {item.label}
          </Link>
        ) : (
          <Typography
            key={item.label}
            aria-current="page"
            noWrap
            sx={{ fontSize: '0.9rem', fontWeight: 800, color: 'text.primary', minWidth: 0 }}
          >
            {item.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  )
}
