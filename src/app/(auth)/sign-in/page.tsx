import { sanitizeInternalPath } from "@/lib/sanitize-next";

import { AuthSplitShell } from "@/components/auth/auth-split-shell";

import { SignInForm } from "./sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const defaultNext = sanitizeInternalPath(sp.next, "/dashboard");
  const signInQuery = sp.next
    ? `?next=${encodeURIComponent(sp.next)}`
    : "";

  return (
    <AuthSplitShell mode="sign-in" signInHref={`/sign-in${signInQuery}`} signUpHref="/sign-up">
      <SignInForm defaultNext={defaultNext} />
    </AuthSplitShell>
  );
}
