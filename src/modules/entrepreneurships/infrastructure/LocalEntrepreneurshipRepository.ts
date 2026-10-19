import { localDatabase } from '../../../data/localDatabase'
import { mergeEntrepreneurships } from '../application/mergeEntrepreneurships'
import type { Entrepreneurship } from '../domain/Entrepreneurship'
import type { EntrepreneurshipRepository } from '../domain/EntrepreneurshipRepository'
import { useEntrepreneurshipStore } from '../state/useEntrepreneurshipStore'

/**
 * Catálogo base (JSON) con lo que los usuarios crearon o editaron en localStorage por encima:
 * si un emprendimiento fue editado, se usa su versión guardada y no la del dominio.
 */
export class LocalEntrepreneurshipRepository implements EntrepreneurshipRepository {
  findAll(): Entrepreneurship[] {
    return mergeEntrepreneurships(localDatabase.entrepreneurships, useEntrepreneurshipStore.getState().entrepreneurships)
  }

  findById(id: string): Entrepreneurship | undefined {
    return this.findAll().find((entrepreneurship) => entrepreneurship.id === id)
  }

  findByOwnerId(ownerUserId: string): Entrepreneurship[] {
    return this.findAll().filter((entrepreneurship) => entrepreneurship.ownerUserId === ownerUserId)
  }
}
