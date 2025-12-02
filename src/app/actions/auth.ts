'use server'

import { cookies } from 'next/headers'
import { compare, hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { loginSchema, createUserSchema, type LoginInput, type CreateUserInput } from '@/lib/validations'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production')

async function createJWT(payload: { userId: number; email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .setIssuedAt()
    .sign(JWT_SECRET)
}

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: number; email: string; role: string }
  } catch {
    return null
  }
}

export async function login(input: LoginInput) {
  try {
    const validated = loginSchema.parse(input)
    
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        active: true,
        name: true,
      },
    })

    if (!user || !user.active) {
      return { error: 'Credenciais inválidas' }
    }

    const isValidPassword = await compare(validated.password, user.passwordHash)
    if (!isValidPassword) {
      return { error: 'Credenciais inválidas' }
    }

    const token = await createJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    })

    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Erro ao fazer login' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  return { success: true }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null

  const payload = await verifyJWT(token)
  if (!payload) {
    cookieStore.delete('auth-token')
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  })

  if (!user || !user.active) {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
    return null
  }

  return user
}

export async function bootstrap(input: CreateUserInput) {
  try {
    // Verificar se já existe algum usuário
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return { error: 'Já existem usuários cadastrados. Use a página de admin para criar novos usuários.' }
    }

    const validated = createUserSchema.parse(input)
    const passwordHash = await hash(validated.password, 10)

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: 'admin',
        functionId: validated.functionId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error('Bootstrap error:', error)
    return { error: 'Erro ao criar usuário admin' }
  }
}

export async function createUser(input: CreateUserInput) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return { error: 'Sem permissão' }
    }

    const validated = createUserSchema.parse(input)
    const passwordHash = await hash(validated.password, 10)

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role,
        functionId: validated.functionId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        function: true,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error('Create user error:', error)
    return { error: 'Erro ao criar usuário' }
  }
}
