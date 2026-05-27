import { z } from 'zod'

export const affiliateSchema = z.object({
  firstName: z.string().trim().min(1, 'El nombre es requerido'),
  lastName: z.string().trim().min(1, 'El apellido es requerido'),
  email: z.string().trim().email('El correo electrónico no es válido'),
  membershipType: z.enum(['silver', 'gold', 'platinum'], {
    message: 'Selecciona un tipo de afiliación válido',
  }),
})

export type AffiliateInput = z.infer<typeof affiliateSchema>
