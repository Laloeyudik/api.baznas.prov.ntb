import { z } from "zod";

const loginAdminSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Email tidak valid, mohon masukkan email valid").regex(/^[a-zA-Z0-9.@\s]+$/),
  password: z
    .string()
    .min(1, "Password wajib diisi").regex(/^[a-zA-Z0-9.@#$!*&]+$/),
});
export default loginAdminSchema;
