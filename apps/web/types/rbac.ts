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

export const permissionSchema = z.object({
  id: z.coerce.number().int().positive(),
  key: apiTextField,
  label: apiTextField,
  group: apiTextField,
  description: apiTextField.nullable().optional(),
  created_at: apiTextField,
});

export const roleSchema = z.object({
  id: z.coerce.number().int().positive(),
  key: apiTextField,
  name: apiTextField,
  description: apiTextField.nullable().optional(),
  is_system: z.coerce.boolean(),
  created_at: apiTextField,
  permissions: z
    .array(permissionSchema)
    .default([]),
});

export const roleCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  key: z.string().trim().max(80).optional(),
  description: z.string().trim().optional(),
  permission_keys: z.array(z.string()).default([]),
});

export const roleUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().optional(),
});

export const rolePermissionsUpdateSchema =
  z.object({
    permission_keys: z.array(z.string()),
  });

export type Permission = z.infer<
  typeof permissionSchema
>;

export type Role = z.infer<typeof roleSchema>;

export type RoleCreateData = z.infer<
  typeof roleCreateSchema
>;

export type RoleUpdateData = z.infer<
  typeof roleUpdateSchema
>;

export type RolePermissionsUpdateData = z.infer<
  typeof rolePermissionsUpdateSchema
>;
