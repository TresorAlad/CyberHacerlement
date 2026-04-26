import type { Role } from "@/generated/prisma/browser";
import { Role as RoleEnum } from "@/generated/prisma/browser";

export function getPostLoginPath(role: Role | null): string {
  switch (role) {
    case RoleEnum.ADMIN:
      return "/admin";
    case RoleEnum.VICTIM:
      return "/dashboard";
    default:
      return "/dashboard";
  }
}
