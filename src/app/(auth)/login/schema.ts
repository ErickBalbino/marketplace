import { z } from "zod";

export const schema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof schema>;
