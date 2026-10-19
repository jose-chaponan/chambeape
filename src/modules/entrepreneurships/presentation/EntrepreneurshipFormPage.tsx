import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { getEntrepreneurshipCategories } from '../../../app/container'
import { fileToPhotoDataUrl } from '../../../shared/infrastructure/photoImage'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import {
  buildEntrepreneurship,
  emptyEntrepreneurshipForm,
  LONG_DESCRIPTION_MAX,
  MAX_GALLERY_PHOTOS,
  SHORT_DESCRIPTION_MAX,
  toEntrepreneurshipForm,
  validateEntrepreneurshipForm,
  type EntrepreneurshipForm,
  type EntrepreneurshipFormErrors,
} from '../domain/EntrepreneurshipForm'
import { LIMA_DISTRICTS } from '../domain/LimaDistricts'
import { useEntrepreneurships } from '../state/useEntrepreneurships'
import { useEntrepreneurshipStore } from '../state/useEntrepreneurshipStore'
import { AppBreadcrumbs } from './components/AppBreadcrumbs'
import { categoryIcons } from './components/categoryIcons'
import { PageShell } from './components/PageShell'
import { CoverPhotoField, GalleryPhotosField } from './components/PhotoFields'
import { ProductsField } from './components/ProductsField'

const MINE = { label: 'Mi emprendimiento', to: '/mi-emprendimiento' }

function FormSection({ title, hint, children }: Readonly<{ title: string; hint?: string; children: ReactNode }>) {
  return (
    <Box component="section" aria-label={title}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {hint && (
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          {hint}
        </Typography>
      )}
      <Stack spacing={2.5} sx={{ mt: 2.5 }}>
        {children}
      </Stack>
    </Box>
  )
}

function focusFirstInvalid() {
  requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]')
    target?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    target?.querySelector<HTMLElement>('input, textarea, [role="combobox"]')?.focus({ preventScroll: true })
    if (target && 'focus' in target && target.tagName !== 'DIV') target.focus({ preventScroll: true })
  })
}

export function EntrepreneurshipFormPage({ mode }: Readonly<{ mode: 'create' | 'edit' }>) {
  const { entrepreneurshipId = '' } = useParams()
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.session?.user.id)
  const catalog = useEntrepreneurships()
  const save = useEntrepreneurshipStore((state) => state.save)
  const categories = useMemo(() => getEntrepreneurshipCategories.execute(), [])

  const existing = mode === 'edit' ? catalog.find((item) => item.id === entrepreneurshipId) : undefined
  const canEdit = mode === 'create' || (existing !== undefined && existing.ownerUserId === userId)

  if (!canEdit || !userId) {
    return (
      <PageShell>
        <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
          <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
            <AppBreadcrumbs items={[MINE, { label: 'No encontrado' }]} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
              No encontramos ese emprendimiento
            </Typography>
            <Typography color="text.secondary">
              Solo puedes editar los emprendimientos que son tuyos. Revisa tu lista para elegir uno.
            </Typography>
            <Button component={RouterLink} to="/mi-emprendimiento" variant="contained">
              Ir a mi emprendimiento
            </Button>
          </Stack>
        </Container>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <FormContent
        // Reinicia el formulario si se cambia de emprendimiento sin salir de la página.
        key={existing?.id ?? 'new'}
        categories={categories}
        existingForm={existing ? toEntrepreneurshipForm(existing) : emptyEntrepreneurshipForm}
        isEdit={mode === 'edit'}
        onSubmit={(form) => {
          const entrepreneurship = buildEntrepreneurship(form, userId, existing)
          if (!save(entrepreneurship)) return false
          navigate(`/emprendimientos/${entrepreneurship.id}`, { state: { from: 'mine' } })
          return true
        }}
      />
    </PageShell>
  )
}

interface FormContentProps {
  categories: ReturnType<typeof getEntrepreneurshipCategories.execute>
  existingForm: EntrepreneurshipForm
  isEdit: boolean
  onSubmit: (form: EntrepreneurshipForm) => boolean
}

function FormContent({ categories, existingForm, isEdit, onSubmit }: Readonly<FormContentProps>) {
  const [form, setForm] = useState<EntrepreneurshipForm>(existingForm)
  const [productDraft, setProductDraft] = useState('')
  const [errors, setErrors] = useState<EntrepreneurshipFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [photoNotice, setPhotoNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const setField = <K extends keyof EntrepreneurshipForm>(field: K, value: EntrepreneurshipForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleCover = async (file: File) => {
    setBusy(true)
    setPhotoNotice(null)
    const result = await fileToPhotoDataUrl(file)
    setBusy(false)
    if (!result.ok) {
      setPhotoNotice(result.message)
      return
    }
    setField('coverImageUrl', result.dataUrl)
  }

  const handleGallery = async (files: File[]) => {
    setBusy(true)
    setPhotoNotice(null)
    const room = MAX_GALLERY_PHOTOS - form.photoUrls.length
    const added: string[] = []
    let problem: string | null = files.length > room ? `Solo caben ${MAX_GALLERY_PHOTOS} fotos en la galería.` : null

    for (const file of files.slice(0, room)) {
      const result = await fileToPhotoDataUrl(file)
      if (result.ok) {
        added.push(result.dataUrl)
      } else {
        problem = result.message
      }
    }
    setBusy(false)
    setPhotoNotice(problem)
    if (added.length > 0) {
      setForm((current) => ({ ...current, photoUrls: [...current.photoUrls, ...added] }))
      setErrors((current) => ({ ...current, photoUrls: undefined }))
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    // Un producto escrito pero sin agregar también cuenta.
    const pending = productDraft.trim()
    const products =
      pending && !form.products.some((product) => product.toLowerCase() === pending.toLowerCase())
        ? [...form.products, pending]
        : form.products
    const candidate = { ...form, products }

    const result = validateEntrepreneurshipForm(candidate)
    if (!result.success) {
      setErrors(result.errors)
      focusFirstInvalid()
      return
    }

    setForm(candidate)
    setProductDraft('')
    if (!onSubmit(result.data)) {
      setSubmitError(
        'No pudimos guardar tus cambios porque el almacenamiento de este dispositivo está lleno. Quita alguna foto e inténtalo de nuevo.',
      )
    }
  }

  const title = isEdit ? 'Editar emprendimiento' : 'Nuevo emprendimiento'
  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <AppBreadcrumbs items={[MINE, { label: title }]} />
        <Typography component="h1" sx={{ fontSize: { xs: '2rem', sm: '2.75rem' }, mb: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '60ch' }}>
          {isEdit
            ? 'Actualiza la información de tu vitrina. Los cambios se ven al guardar.'
            : 'Cuéntale al Perú qué haces. Tu vitrina se publica en el catálogo al guardar.'}
        </Typography>

        <Paper
          component="form"
          noValidate
          aria-label={title}
          elevation={0}
          onSubmit={handleSubmit}
          sx={{ border: 1, borderColor: 'divider', p: { xs: 2.5, sm: 4 } }}
        >
          <Stack spacing={4} divider={<Divider flexItem />}>
            {hasErrors && (
              <Alert severity="error" role="alert">
                Revisa los campos marcados en rojo para poder guardar.
              </Alert>
            )}

            <FormSection title="Tu emprendimiento">
              <TextField
                required
                label="Nombre del emprendimiento"
                value={form.businessName}
                onChange={(event) => setField('businessName', event.target.value)}
                error={Boolean(errors.businessName)}
                helperText={errors.businessName}
                slotProps={{ htmlInput: { maxLength: 60 } }}
              />
              <TextField
                select
                required
                label="Categoría"
                value={form.categoryId}
                onChange={(event) => setField('categoryId', event.target.value)}
                error={Boolean(errors.categoryId)}
                helperText={errors.categoryId}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <ListItemIcon>{categoryIcons[category.icon]}</ListItemIcon>
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                label="Descripción corta"
                value={form.shortDescription}
                onChange={(event) => setField('shortDescription', event.target.value)}
                error={Boolean(errors.shortDescription)}
                helperText={errors.shortDescription ?? `${form.shortDescription.length}/${SHORT_DESCRIPTION_MAX} · Aparece en las tarjetas.`}
                slotProps={{ htmlInput: { maxLength: SHORT_DESCRIPTION_MAX } }}
              />
              <TextField
                required
                multiline
                minRows={4}
                label="Tu historia"
                value={form.longDescription}
                onChange={(event) => setField('longDescription', event.target.value)}
                error={Boolean(errors.longDescription)}
                helperText={errors.longDescription ?? `${form.longDescription.length}/${LONG_DESCRIPTION_MAX}`}
                slotProps={{ htmlInput: { maxLength: LONG_DESCRIPTION_MAX } }}
              />
            </FormSection>

            <FormSection title="Qué ofreces" hint="Menciona algunos de tus productos o servicios como ejemplo.">
              <ProductsField
                products={form.products}
                draft={productDraft}
                error={errors.products}
                onProductsChange={(products) => setField('products', products)}
                onDraftChange={setProductDraft}
              />
            </FormSection>

            <FormSection title="Dónde atiendes" hint="Chambea Pe solo está disponible en Lima por ahora.">
              <TextField
                select
                required
                label="Distrito"
                value={form.district}
                onChange={(event) => setField('district', event.target.value)}
                error={Boolean(errors.district)}
                helperText={errors.district}
              >
                {LIMA_DISTRICTS.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
            </FormSection>

            <FormSection title="Fotos" hint="La portada es lo primero que verán en el catálogo.">
              {photoNotice && (
                <Alert severity="warning" onClose={() => setPhotoNotice(null)}>
                  {photoNotice}
                </Alert>
              )}
              <CoverPhotoField
                value={form.coverImageUrl}
                error={errors.coverImageUrl}
                busy={busy}
                onPick={handleCover}
                onRemove={() => setField('coverImageUrl', '')}
              />
              <GalleryPhotosField
                photos={form.photoUrls}
                error={errors.photoUrls}
                busy={busy}
                onPick={handleGallery}
                onRemove={(index) =>
                  setField(
                    'photoUrls',
                    form.photoUrls.filter((_, photoIndex) => photoIndex !== index),
                  )
                }
              />
            </FormSection>

            <FormSection title="Contacto y redes" hint="Todo es opcional. Solo se muestra lo que completes.">
              <TextField
                label="WhatsApp"
                type="tel"
                value={form.whatsapp}
                onChange={(event) => setField('whatsapp', event.target.value.replaceAll(/\D/g, '').slice(0, 9))}
                error={Boolean(errors.whatsapp)}
                helperText={errors.whatsapp ?? 'Celular de 9 dígitos. Activa el botón "Contáctanos".'}
                slotProps={{
                  input: { startAdornment: <InputAdornment position="start">+51</InputAdornment> },
                  htmlInput: { inputMode: 'numeric' },
                }}
              />
              {(['facebook', 'instagram', 'tiktok', 'website'] as const).map((network) => (
                <TextField
                  key={network}
                  type="url"
                  label={{ facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', website: 'Sitio web' }[network]}
                  placeholder="https://"
                  value={form[network]}
                  onChange={(event) => setField(network, event.target.value)}
                  error={Boolean(errors[network])}
                  helperText={errors[network]}
                />
              ))}
            </FormSection>

            <FormSection title="Datos del titular" hint="No se muestran en tu vitrina.">
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
                <TextField
                  required
                  label="DNI"
                  value={form.ownerDni}
                  onChange={(event) => setField('ownerDni', event.target.value.replaceAll(/\D/g, '').slice(0, 8))}
                  error={Boolean(errors.ownerDni)}
                  helperText={errors.ownerDni ?? '8 dígitos.'}
                  slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                />
                <TextField
                  label="RUC"
                  value={form.ruc}
                  onChange={(event) => setField('ruc', event.target.value.replaceAll(/\D/g, '').slice(0, 11))}
                  error={Boolean(errors.ruc)}
                  helperText={errors.ruc ?? 'Opcional. 11 dígitos.'}
                  slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                />
              </Box>
            </FormSection>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button component={RouterLink} to="/mi-emprendimiento" color="inherit">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={busy}>
                {isEdit ? 'Guardar cambios' : 'Publicar emprendimiento'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
