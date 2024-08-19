import * as z from "zod"

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres." })
    .max(30, { message: "Máximo de 30 caracteres." }),
  username: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres." })
    .max(30, { message: "Máximo de 30 caracteres." }),
  bio: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres." })
    .max(1000, { message: "Máximo de 100 caracteres." }),
})
