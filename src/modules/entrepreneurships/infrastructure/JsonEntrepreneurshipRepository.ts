import { localDatabase } from '../../../data/localDatabase'
import type { Entrepreneurship } from '../domain/Entrepreneurship'
import type { EntrepreneurshipRepository } from '../domain/EntrepreneurshipRepository'

export class JsonEntrepreneurshipRepository implements EntrepreneurshipRepository {
  findAll(): Entrepreneurship[] {
    return localDatabase.entrepreneurships
  }

  findByOwnerId(ownerUserId: string): Entrepreneurship[] {
    return localDatabase.entrepreneurships.filter(
      (entrepreneurship) => entrepreneurship.ownerUserId === ownerUserId,
    )
  }
}
