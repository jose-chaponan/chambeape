import { describe, expect, it } from 'vitest'
import { localDatabase } from '../../../data/localDatabase'
import { getEntrepreneurshipDistricts, getRelatedEntrepreneurships, searchEntrepreneurships } from './SearchEntrepreneurships'

const all = localDatabase.entrepreneurships
const names = (results: typeof all) => results.map((entrepreneurship) => entrepreneurship.businessName)

describe('searchEntrepreneurships', () => {
  it('returns everything without criteria', () => {
    expect(searchEntrepreneurships(all, {})).toHaveLength(all.length)
  })

  it('finds entrepreneurships by product ignoring case and accents', () => {
    expect(names(searchEntrepreneurships(all, { query: 'PACHAMANCA' }))).toEqual(['Sabor Andino'])
    expect(names(searchEntrepreneurships(all, { query: 'blazers' }))).toEqual(['Sastrería Ríos'])
    expect(names(searchEntrepreneurships(all, { query: 'menu ejecutivo' }))).toEqual(['Sabor Andino'])
  })

  it('filters by district', () => {
    expect(names(searchEntrepreneurships(all, { district: 'Breña' }))).toEqual(['Sastrería Ríos'])
  })

  it('combines product, district and category', () => {
    expect(searchEntrepreneurships(all, { query: 'pachamanca', district: 'Breña' })).toEqual([])
    expect(names(searchEntrepreneurships(all, { query: 'chicha', categoryIds: ['food'] }))).toEqual([
      'Sabor Andino',
      'Emolientes Don Pepe',
    ])
  })

  it('lists each district once, sorted', () => {
    const districts = getEntrepreneurshipDistricts(all)

    expect(new Set(districts).size).toBe(districts.length)
    expect(districts).toEqual([...districts].sort((a, b) => a.localeCompare(b, 'es')))
    expect(districts).toContain('Yanahuara')
  })

  it('gives every entrepreneurship products and a location', () => {
    all.forEach((entrepreneurship) => {
      expect(entrepreneurship.products.length).toBeGreaterThan(0)
      expect(entrepreneurship.location.district).not.toBe('')
    })
  })
})

describe('getRelatedEntrepreneurships', () => {
  it('only returns entrepreneurships of the same category, never the current one', () => {
    const saborAndino = all.find((entrepreneurship) => entrepreneurship.id === 'ent-sabor-andino')!
    const related = getRelatedEntrepreneurships(all, saborAndino)

    expect(related.map((entrepreneurship) => entrepreneurship.id).sort()).toEqual([
      'ent-emolientes-don-pepe',
      'ent-panaderia-buen-horno',
    ])
  })

  it('returns nothing when the category has no other entrepreneurship', () => {
    const ferreteria = all.find((entrepreneurship) => entrepreneurship.id === 'ent-ferreteria-el-constructor')!

    expect(getRelatedEntrepreneurships(all, ferreteria)).toEqual([])
  })
})
