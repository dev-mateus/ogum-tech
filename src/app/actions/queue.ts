'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from './auth'
import {
  addToQueueSchema,
  assignMediumSchema,
  updateQueueStatusSchema,
  type AddToQueueInput,
  type AssignMediumInput,
  type UpdateQueueStatusInput,
} from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function getOpenGiras() {
  try {
    const giras = await prisma.gira.findMany({
      where: { status: 'aberta' },
      include: {
        giraType: true,
        _count: {
          select: {
            queueEntries: true,
            mediums: true,
          },
        },
      },
      orderBy: { openedAt: 'desc' },
    })

    return { success: true, giras }
  } catch {
    return { error: 'Erro ao buscar giras' }
  }
}

export async function getGiraQueue(giraId: number) {
  try {
    const queue = await prisma.queueEntry.findMany({
      where: { giraId },
      include: {
        assignedMedium: {
          select: {
            id: true,
            name: true,
            function: true,
          },
        },
      },
      orderBy: { sequence: 'asc' },
    })

    // Serializar dates para strings (Next.js Server Actions)
    const serializedQueue = queue.map(entry => ({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      startedAt: entry.startedAt?.toISOString() || null,
      finishedAt: entry.finishedAt?.toISOString() || null,
    }))

    return { success: true, queue: serializedQueue }
  } catch {
    return { success: false, error: 'Erro ao buscar fila' }
  }
}

export async function addToQueue(input: AddToQueueInput) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Não autenticado' }
    }

    const validated = addToQueueSchema.parse(input)

    // Pegar o próximo número de sequência
    const lastEntry = await prisma.queueEntry.findFirst({
      where: { giraId: validated.giraId },
      orderBy: { sequence: 'desc' },
      select: { sequence: true },
    })

    const nextSequence = (lastEntry?.sequence || 0) + 1

    const entry = await prisma.queueEntry.create({
      data: {
        giraId: validated.giraId,
        consultantName: validated.consultantName,
        consultantPhone: validated.consultantPhone,
        sequence: nextSequence,
        status: 'aguardando',
      },
      include: {
        assignedMedium: {
          select: {
            id: true,
            name: true,
            function: true,
          },
        },
      },
    })

    revalidatePath(`/gira/${validated.giraId}`)
    return { success: true, entry }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao adicionar à fila'
    return { error: message }
  }
}

export async function assignMedium(input: AssignMediumInput) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Não autenticado' }
    }

    const validated = assignMediumSchema.parse(input)

    // Marcar o anterior como atendido se houver
    const currentEntry = await prisma.queueEntry.findUnique({
      where: { id: validated.queueEntryId },
      select: { assignedMediumId: true, giraId: true },
    })

    if (currentEntry?.assignedMediumId) {
      await prisma.queueEntry.updateMany({
        where: {
          giraId: currentEntry.giraId,
          assignedMediumId: currentEntry.assignedMediumId,
          status: 'em_atendimento',
        },
        data: {
          status: 'atendido',
          finishedAt: new Date(),
        },
      })
    }

    // Atribuir médium e mudar status para em_atendimento
    const entry = await prisma.queueEntry.update({
      where: { id: validated.queueEntryId },
      data: {
        assignedMediumId: validated.mediumId,
        status: 'em_atendimento',
        startedAt: new Date(),
      },
      include: {
        assignedMedium: {
          select: {
            id: true,
            name: true,
            function: true,
          },
        },
      },
    })

    if (currentEntry) {
      revalidatePath(`/gira/${currentEntry.giraId}`)
    }
    return { success: true, entry }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao atribuir médium'
    return { error: message }
  }
}

export async function updateQueueStatus(input: UpdateQueueStatusInput) {
  try {
    const session = await getSession()
    if (!session) {
      return { error: 'Não autenticado' }
    }

    const validated = updateQueueStatusSchema.parse(input)

    const currentEntry = await prisma.queueEntry.findUnique({
      where: { id: validated.queueEntryId },
      select: { giraId: true },
    })

    const updateData: {
      status: string
      finishedAt?: Date
      startedAt?: Date
    } = { status: validated.status }

    if (validated.status === 'atendido') {
      updateData.finishedAt = new Date()
    } else if (validated.status === 'em_atendimento') {
      updateData.startedAt = new Date()
    }

    const entry = await prisma.queueEntry.update({
      where: { id: validated.queueEntryId },
      data: updateData,
      include: {
        assignedMedium: {
          select: {
            id: true,
            name: true,
            function: true,
          },
        },
      },
    })

    if (currentEntry) {
      revalidatePath(`/gira/${currentEntry.giraId}`)
    }
    return { success: true, entry }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar status'
    return { error: message }
  }
}
