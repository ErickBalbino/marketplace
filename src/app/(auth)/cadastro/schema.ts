import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Informe seu nome"),
    email: z.email("Informe um e-mail válido"),
    phone: z
      .string()
      .min(1, "Informe seu telefone")
      .refine((v) => /^\d{10,11}$/.test(v), "Telefone inválido"),
    cpf: z
      .string()
      .min(1, "Informe seu CPF")
      .refine((v) => cpf.isValid(v), "CPF inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirm: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
