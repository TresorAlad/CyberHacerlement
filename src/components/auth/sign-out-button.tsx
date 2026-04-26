"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type SignOutButtonProps = {
  className?: string;
  showIcon?: boolean;
} & VariantProps<typeof buttonVariants>;

export function SignOutButton({
  className,
  variant = "secondary",
  size = "sm",
  showIcon = false,
}: SignOutButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(showIcon && "gap-2", className)}
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {showIcon ? <LogOut className="size-4 shrink-0" aria-hidden /> : null}
      Déconnexion
    </Button>
  );
}
