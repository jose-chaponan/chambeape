import { describe, expect, it } from 'vitest'
import { localDatabase } from './localDatabase'

const { entrepreneurships, categories } = localDatabase

// Vite lista los archivos reales de /public sin necesidad de APIs de Node.
const publicFiles = new Set(Object.keys(import.meta.glob('/public/emprendimientos/**/*.webp')))

describe('catalog data', () => {
  it('has unique ids and business names', () => {
    expect(new Set(entrepreneurships.map((item) => item.id)).size).toBe(entrepreneurships.length)
    expect(new Set(entrepreneurships.map((item) => item.businessName)).size).toBe(entrepreneurships.length)
  })

  it('gives every entrepreneurship a cover and gallery photos that exist as .webp files', () => {
    for (const entrepreneurship of entrepreneurships) {
      expect(entrepreneurship.coverImageUrl, entrepreneurship.businessName).toBeTruthy()
      expect(entrepreneurship.photoUrls.length, entrepreneurship.businessName).toBeGreaterThanOrEqual(2)

      for (const url of [entrepreneurship.coverImageUrl!, ...entrepreneurship.photoUrls]) {
        expect(url.endsWith('.webp'), url).toBe(true)
        expect(publicFiles.has(`/public${url}`), url).toBe(true)
      }
    }
  })

  it('includes importers and clothing sellers, with a mix of verified and unverified', () => {
    const imports = entrepreneurships.filter((item) => item.categoryId === 'imports')
    const fashion = entrepreneurships.filter((item) => item.categoryId === 'fashion')

    expect(categories.find((category) => category.id === 'imports')?.name).toBe('Importaciones y comercio')
    expect(imports.length).toBeGreaterThanOrEqual(15)
    expect(fashion.length).toBeGreaterThanOrEqual(15)
    for (const group of [imports, fashion]) {
      expect(group.some((item) => item.verified)).toBe(true)
      expect(group.some((item) => !item.verified)).toBe(true)
    }
  })

  it('keeps every entrepreneurship in Lima with social networks and WhatsApp', () => {
    for (const { businessName, location, socialLinks } of entrepreneurships) {
      expect(location.province, businessName).toBe('Lima')
      expect(socialLinks.whatsapp, businessName).toMatch(/^9\d{8}$/)
    }
    const numbers = entrepreneurships.map((item) => item.socialLinks.whatsapp)
    expect(new Set(numbers).size).toBe(numbers.length)
  })
})
