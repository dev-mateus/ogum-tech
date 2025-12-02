'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from './auth'
import {
  createFunctionSchema,
  createGiraTypeSchema,
  createGiraSchema,
  markPresenceSchema,
  type CreateFunctionInput,
  type CreateGiraTypeInput,
  type CreateGiraInput,
} from '@/lib/validations'

// Middleware helper
async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    throw new Error('Sem permissão')
  }
  return session
}

export async function createFunction(input: CreateFunctionInput) {
  try {
    await requireAdmin()
    const validated = createFunctionSchema.parse(input)

    const func = await prisma.function.create({
      data: { name: validated.name },
    })

    return { success: true, function: func }
  } catch (error: any) {
    return { error: error.message || 'Erro ao criar função' }
  }
}

export async function createGiraType(input: CreateGiraTypeInput) {
  try {
    await requireAdmin()
    const validated = createGiraTypeSchema.parse(input)

    const giraType = await prisma.giraType.create({
      data: { name: validated.name },
    })

    return { success: true, giraType }
  } catch (error: any) {
    return { error: error.message || 'Erro ao criar tipo de gira' }
  }
}

export async function getGiraTypes() {
  try {
    const giraTypes = await prisma.giraType.findMany({
      orderBy: { name: 'asc' },
    })
    return { success: true, giraTypes }
  } catch (error) {
    return { error: 'Erro ao buscar tipos de gira' }
  }
}

export async function getFunctions() {
  try {
    const functions = await prisma.function.findMany({
      orderBy: { name: 'asc' },
    })
    return { success: true, functions }
  } catch (error) {
    return { error: 'Erro ao buscar funções' }
  }
}

export async function createGira(input: CreateGiraInput) {
  try {
    await requireAdmin()
    const validated = createGiraSchema.parse(input)

    const gira = await prisma.gira.create({
      data: {
        giraTypeId: validated.giraTypeId,
        status: 'aberta',
      },
      include: {
        giraType: true,
      },
    })

    return { success: true, gira }
  } catch (error: any) {
    return { error: error.message || 'Erro ao abrir gira' }
  }
}

export async function closeGira(giraId: number) {
  try {
    await requireAdmin()

    // Verificar se há consulentes aguardando ou em atendimento
    const pending = await prisma.queueEntry.count({
      where: {
        giraId,
        status: { in: ['aguardando', 'em_atendimento'] },
      },
    })

    if (pending > 0) {
      return { error: 'Não é possível encerrar gira com consulentes aguardando ou em atendimento' }
    }

    const gira = await prisma.gira.update({
      where: { id: giraId },
      data: {
        status: 'encerrada',
        closedAt: new Date(),
      },
    })

    return { success: true, gira }
  } catch (error: any) {
    return { error: error.message || 'Erro ao encerrar gira' }
  }
}

export async function markPresence(giraId: number, mediumIds: number[]) {
  try {
    await requireAdmin()

    // Remover presenças antigas
    await prisma.giraMedium.deleteMany({
      where: { giraId },
    })

    // Adicionar novas presenças
    await prisma.giraMedium.createMany({
      data: mediumIds.map(mediumId => ({ giraId, mediumId })),
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Erro ao marcar presença' }
  }
}

export async function getGiraMediums(giraId: number) {
  try {
    const mediums = await prisma.giraMedium.findMany({
      where: { giraId },
      include: {
        medium: {
          select: {
            id: true,
            name: true,
            function: true,
          },
        },
      },
    })

    return { success: true, mediums: mediums.map((gm: { medium: any }) => gm.medium) }
  } catch (error) {
    return { error: 'Erro ao buscar médiuns' }
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: { active: true },
      include: { function: true },
      orderBy: { name: 'asc' },
    })
    return { success: true, users }
  } catch (error) {
    return { error: 'Erro ao buscar usuários' }
  }
}
