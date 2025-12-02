import { z } from 'zod'

// Auth
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['admin', 'user']),
  functionId: z.number().int().positive().optional(),
})

// Admin
export const createFunctionSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
})

export const createGiraTypeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
})

export const createGiraSchema = z.object({
  giraTypeId: z.number().int().positive('Selecione um tipo de gira'),
})

export const markPresenceSchema = z.object({
  giraId: z.number().int().positive(),
  mediumId: z.number().int().positive(),
})

// Queue
export const addToQueueSchema = z.object({
  giraId: z.number().int().positive(),
  consultantName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  consultantPhone: z.string().optional(),
})

export const assignMediumSchema = z.object({
  queueEntryId: z.number().int().positive(),
  mediumId: z.number().int().positive(),
})

export const updateQueueStatusSchema = z.object({
  queueEntryId: z.number().int().positive(),
  status: z.enum(['aguardando', 'em_atendimento', 'atendido', 'cancelado']),
})

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateFunctionInput = z.infer<typeof createFunctionSchema>
export type CreateGiraTypeInput = z.infer<typeof createGiraTypeSchema>
export type CreateGiraInput = z.infer<typeof createGiraSchema>
export type AddToQueueInput = z.infer<typeof addToQueueSchema>
export type AssignMediumInput = z.infer<typeof assignMediumSchema>
export type UpdateQueueStatusInput = z.infer<typeof updateQueueStatusSchema>
