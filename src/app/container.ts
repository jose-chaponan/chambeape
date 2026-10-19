import { AuthenticateUser } from '../modules/authentication/application/authenticateUser'
import { GetAllEntrepreneurships } from '../modules/entrepreneurships/application/GetAllEntrepreneurships'
import { GetEntrepreneurshipById } from '../modules/entrepreneurships/application/GetEntrepreneurshipById'
import { GetEntrepreneurshipCategories } from '../modules/entrepreneurships/application/GetEntrepreneurshipCategories'
import { GetEntrepreneurshipsForUser } from '../modules/entrepreneurships/application/GetEntrepreneurshipsForUser'
import { JsonEntrepreneurshipCategoryRepository } from '../modules/entrepreneurships/infrastructure/JsonEntrepreneurshipCategoryRepository'
import { JsonEntrepreneurshipRepository } from '../modules/entrepreneurships/infrastructure/JsonEntrepreneurshipRepository'
import { JsonUserRepository } from '../modules/users/infrastructure/JsonUserRepository'

// Composition root: único lugar que conoce las implementaciones concretas (infraestructura).
// La capa de presentación solo consume casos de uso desde aquí.
const userRepository = new JsonUserRepository()
const entrepreneurshipRepository = new JsonEntrepreneurshipRepository()
const categoryRepository = new JsonEntrepreneurshipCategoryRepository()

export const authenticateUser = new AuthenticateUser(userRepository)
export const getAllEntrepreneurships = new GetAllEntrepreneurships(entrepreneurshipRepository)
export const getEntrepreneurshipsForUser = new GetEntrepreneurshipsForUser(entrepreneurshipRepository)
export const getEntrepreneurshipCategories = new GetEntrepreneurshipCategories(categoryRepository)
export const getEntrepreneurshipById = new GetEntrepreneurshipById(entrepreneurshipRepository)
