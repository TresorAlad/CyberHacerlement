import type { Role } from "@/generated/prisma/browser";
import { Role as RoleEnum } from "@/generated/prisma/browser";

const ALL_ROLES: Role[] = [
  RoleEnum.VICTIM,
  RoleEnum.MODERATOR,
  RoleEnum.PSYCHOLOGIST,
  RoleEnum.LAWYER,
  RoleEnum.ADMIN,
];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ALL_ROLES as string[]).includes(value);
}

export function getUserRole(sessionUser: unknown): Role | null {
  if (!sessionUser || typeof sessionUser !== "object") return null;
  const role = (sessionUser as { role?: unknown }).role;
  return isRole(role) ? role : null;
}
