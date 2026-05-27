import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().trim().email('Correo electrónico inválido'),

  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Correo electrónico inválido'),

  password: z.string().min(1, 'La contraseña es requerida'),
})
