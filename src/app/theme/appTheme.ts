import { createTheme, responsiveFontSizes } from '@mui/material/styles'

/** Alto de la barra superior por breakpoint; lo usan el AppBar y los elementos sticky que cuelgan de ella. */
export const APP_BAR_HEIGHT = { xs: 64, sm: 72 } as const

/** Margen lateral de las páginas (en unidades de spacing): 28 px en móvil (24 px desde sm). */
export const PAGE_GUTTER = 3.5

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#f60563', dark: '#bd0049', contrastText: '#ffffff' },
    secondary: { main: '#c6f72a', dark: '#94bd00', contrastText: '#192000' },
    background: { default: '#fff9fc', paper: '#ffffff' },
    text: { primary: '#281323', secondary: '#6e5868' },
    divider: 'rgba(40, 19, 35, 0.1)',
  },
  typography: {
    fontFamily: 'Inter, Avenir, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontWeight: 750, letterSpacing: '-0.025em' },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, minHeight: 46 } } },
    // Redondeo sutil en todos los campos (TextField, Select, Autocomplete).
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 4 } } },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          // MUI deja 16 px en móvil; el contenido quedaba muy pegado a los bordes.
          [theme.breakpoints.down('sm')]: { paddingInline: theme.spacing(PAGE_GUTTER) },
        }),
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
})

export const appTheme = responsiveFontSizes(baseTheme)
