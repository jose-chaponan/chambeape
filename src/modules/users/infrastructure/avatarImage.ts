export const AVATAR_SIZE = 256
export const MAX_AVATAR_FILE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export type AvatarResult = { ok: true; dataUrl: string } | { ok: false; message: string }

/** Recorta al centro y reduce la foto a un cuadrado pequeño para que quepa en localStorage. */
export async function fileToAvatarDataUrl(file: File): Promise<AvatarResult> {
  if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
    return { ok: false, message: 'Usa una imagen JPG, PNG o WebP.' }
  }
  if (file.size > MAX_AVATAR_FILE_BYTES) {
    return { ok: false, message: 'La imagen pesa más de 5 MB. Elige una más liviana.' }
  }

  try {
    const bitmap = await createImageBitmap(file)
    const side = Math.min(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = AVATAR_SIZE
    canvas.height = AVATAR_SIZE

    const context = canvas.getContext('2d')
    if (!context) {
      return { ok: false, message: 'Tu navegador no pudo procesar la imagen.' }
    }
    context.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE,
    )
    bitmap.close()

    return { ok: true, dataUrl: canvas.toDataURL('image/jpeg', 0.85) }
  } catch {
    return { ok: false, message: 'No pudimos leer esa imagen. Prueba con otra.' }
  }
}
