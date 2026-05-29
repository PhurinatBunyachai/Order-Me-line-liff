import { z } from 'zod'

export const orderFormSchema = z.object({
  // must be one of the 5 sweetness levels; output narrows to ProductCart.sweetness (100|75|50|25|0)
  sweetness: z
    .number({
      required_error: 'Please select a sweetness level',
      invalid_type_error: 'Please select a sweetness level'
    })
    .refine((v): v is 100 | 75 | 50 | 25 | 0 => [100, 75, 50, 25, 0].includes(v), {
      message: 'Please select a sweetness level'
    }),
  note: z.string().max(200, 'Note must be 200 characters or fewer').optional()
})

export type OrderForm = z.infer<typeof orderFormSchema>
