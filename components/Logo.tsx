import { cn } from "@/lib/utils";

/** The mark: a highlighted fill-in slot, the same device used on every prompt. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-7 w-7 shrink-0", className)}>
      <rect width="32" height="32" rx="7" fill="#FFE15A" />
      <path
        d="M12 9H9v14h3M20 9h3v14h-3"
        fill="none"
        stroke="#1B1F3B"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="14.2" y="14.2" width="3.6" height="3.6" rx="1" fill="#1B1F3B" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight">digizenk</span>
    </span>
  );
}
