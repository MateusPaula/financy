import { prismaClient } from '../../prisma/prisma.js'
import type { LoginInput, RegisterInput } from '../dtos/input/auth.input.js'
import { comparePassword, hashPassword } from '../utils/hash.js'
import { signJwt } from '../utils/jwt.js'

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prismaClient.user.findUnique({
      where: { email: data.email },
    })

    if (existing) throw new Error('E-mail já cadastrado')

    const hash = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: { name: data.name, email: data.email, password: hash },
    })

    const token = signJwt({ id: user.id, email: user.email }, '7d')

    return { token, user }
  }

  async login(data: LoginInput) {
    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    })

    if (!user) throw new Error('Usuário não encontrado')

    const valid = await comparePassword(data.password, user.password)

    if (!valid) throw new Error('Senha inválida')

    const token = signJwt({ id: user.id, email: user.email }, '7d')

    return { token, user }
  }
}
