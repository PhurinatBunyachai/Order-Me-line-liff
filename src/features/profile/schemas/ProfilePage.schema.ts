import { z } from 'zod'

export const profileAddressSchema = z.object({
  building: z.string().trim().min(1, 'Building is required'),
  roomId: z.string().trim().min(1, 'Room ID is required'),
  tel: z
    .string()
    .trim()
    .min(1, 'Telephone is required')
    .regex(/^[0-9]{9,10}$/, 'Enter a valid phone number (9–10 digits)')
})

export type ProfileAddressForm = z.infer<typeof profileAddressSchema>
