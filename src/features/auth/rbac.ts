const ROLE_PERMISSIONS: Record<string, string[]> = {
  guest: ["quest:play"],
  user: ["quest:play", "account:manage"],
  admin: ["quest:play", "account:manage", "users:manage"]
};

export function permissionsForRoles(roles: string[]): string[] {
  return Array.from(new Set(roles.flatMap((role) => ROLE_PERMISSIONS[role] ?? [])));
}
