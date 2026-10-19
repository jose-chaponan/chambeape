export const PHOTO_MAX_SIDE = 1200
export const MAX_PHOTO_FILE_BYTES = 8 * 1024 * 1024
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Mismo tope que acepta el esquema de emprendimientos (localStorage tiene ~5 MB en total).
const MAX_DATA_URL_LENGTH = 300_000

export type PhotoResult = { ok: true; dataUrl: string } | { ok: false; message: string }

/** Reduce la foto (máx. 1200 px de lado) y la guarda como JPEG para que quepa en localStorage. */
export async function fileToPhotoDataUrl(file: File): Promise<PhotoResult> {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return { ok: false, message: 'Usa una imagen JPG, PNG o WebP.' }
  }
  if (file.size > MAX_PHOTO_FILE_BYTES) {
    return { ok: false, message: 'La imagen pesa más de 8 MB. Elige una más liviana.' }
  }

  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      bitmap.close()
      return { ok: false, message: 'Tu navegador no pudo procesar la imagen.' }
    }

    // Si aún pesa demasiado se reintenta con menos calidad y tamaño.
    for (const [maxSide, quality] of [
      [PHOTO_MAX_SIDE, 0.82],
      [PHOTO_MAX_SIDE, 0.65],
      [900, 0.6],
      [700, 0.55],
    ] as const) {
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
      canvas.width = Math.round(bitmap.width * scale)
      canvas.height = Math.round(bitmap.height * scale)
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      if (dataUrl.length <= MAX_DATA_URL_LENGTH) {
        bitmap.close()
        return { ok: true, dataUrl }
      }
    }

    bitmap.close()
    return { ok: false, message: 'La imagen es demasiado pesada incluso reducida. Prueba con otra.' }
  } catch {
    return { ok: false, message: 'No pudimos leer esa imagen. Prueba con otra.' }
  }
}
