import { AuthSplitShell } from "@/components/auth/auth-split-shell";

import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <AuthSplitShell mode="sign-up">
      <SignUpForm />
    </AuthSplitShell>
  );
}
