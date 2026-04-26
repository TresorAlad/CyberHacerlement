import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function AuthUnderlineField({
  id,
  name,
  type,
  autoComplete,
  placeholder,
  icon: Icon,
  required,
  minLength,
}: {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 border-b border-border pb-2.5 transition-[border-color,box-shadow] duration-200 ease-out",
        "focus-within:border-accent",
        "focus-within:shadow-[0_12px_28px_-14px_color-mix(in_oklab,var(--accent)_28%,transparent)]",
      )}
    >
      <Icon
        className="size-5 shrink-0 text-muted-foreground transition-colors duration-200 group-focus-within:text-accent"
        aria-hidden
      />
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
      />
    </div>
  );
}
