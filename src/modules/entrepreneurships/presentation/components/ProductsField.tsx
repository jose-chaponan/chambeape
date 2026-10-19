import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { Box, Button, Chip, FormHelperText, InputAdornment, TextField } from '@mui/material'
import { MAX_PRODUCTS } from '../../domain/EntrepreneurshipForm'

interface ProductsFieldProps {
  products: string[]
  draft: string
  error?: string
  onProductsChange: (products: string[]) => void
  onDraftChange: (draft: string) => void
}

/** Lista de productos o servicios: se escribe, se agrega con Enter o coma, y cada uno se puede quitar. */
export function ProductsField({
  products,
  draft,
  error,
  onProductsChange,
  onDraftChange,
}: Readonly<ProductsFieldProps>) {
  const isFull = products.length >= MAX_PRODUCTS

  const add = () => {
    const value = draft.trim()
    if (!value || isFull) return
    const alreadyAdded = products.some((product) => product.toLowerCase() === value.toLowerCase())
    if (!alreadyAdded) {
      onProductsChange([...products, value])
    }
    onDraftChange('')
  }

  return (
    <Box>
      <TextField
        fullWidth
        label="Producto o servicio"
        placeholder="Ej. Pachamanca"
        value={draft}
        disabled={isFull}
        error={Boolean(error)}
        onChange={(event) => onDraftChange(event.target.value.slice(0, 60))}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault()
            add()
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Button size="small" startIcon={<AddRoundedIcon />} disabled={!draft.trim() || isFull} onClick={add}>
                  Agregar
                </Button>
              </InputAdornment>
            ),
          },
        }}
      />
      <FormHelperText error={Boolean(error)} sx={{ mx: 1.75 }}>
        {error ?? `Escribe uno y presiona Enter. ${products.length}/${MAX_PRODUCTS} agregados.`}
      </FormHelperText>
      {products.length > 0 && (
        <Box
          component="ul"
          aria-label="Productos y servicios agregados"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, m: 0, mt: 1.5, p: 0, listStyle: 'none' }}
        >
          {products.map((product) => (
            <li key={product}>
              <Chip
                label={product}
                onDelete={() => onProductsChange(products.filter((item) => item !== product))}
                deleteIcon={<CancelRoundedIcon titleAccess={`Quitar ${product}`} />}
              />
            </li>
          ))}
        </Box>
      )}
    </Box>
  )
}
