-- Align Better Auth expected table names (@@map) without dropping data.

ALTER TABLE "User" RENAME TO "user";
ALTER TABLE "Session" RENAME TO "session";
ALTER TABLE "Account" RENAME TO "account";
ALTER TABLE "Verification" RENAME TO "verification";
