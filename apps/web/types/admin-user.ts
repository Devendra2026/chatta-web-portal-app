import { z } from "zod";

const apiTextField = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value).trim();
  },
  z.string()
);

export const signupUserSchema = z.object({
  id: z.coerce.number().int().positive(),
  clerk_id: apiTextField,
  name: apiTextField,
  email: apiTextField,
  role: apiTextField,
  created_at: apiTextField.optional(),
});

export const roleSchema = z.object({
  id: z.coerce.number().int().positive(),
  key: apiTextField,
  name: apiTextField,
  description: apiTextField.nullable().optional(),
});

export type SignupUser = z.infer<
  typeof signupUserSchema
>;

export type AdminRole = z.infer<typeof roleSchema>;

export type RoleOption = {
  value: string;
  label: string;
};

export type UpdateUserRoleData = {
  name: string;
  role: string;
};
