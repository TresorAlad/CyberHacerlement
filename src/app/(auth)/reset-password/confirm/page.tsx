import { ResetPasswordConfirmForm } from "./reset-confirm-form";

export default async function ResetPasswordConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return <ResetPasswordConfirmForm token={sp.token} error={sp.error} />;
}
