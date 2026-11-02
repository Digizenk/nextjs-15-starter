"use client";

import { Button } from "@/components/ui/button";
import { normalizeEmail, validateEmail } from "@/lib/email";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const ERROR_KEYS: Record<string, string> = {
  too_many_requests: "tooMany",
  disposable_email_not_allowed: "disposable",
  not_configured: "notConfigured",
  invalid_email_format: "defaultErrorMessage",
  email_part_too_long: "defaultErrorMessage",
};

/**
 * Email sign-up for the free prompt pack.
 * `tone="inverse"` is for dark bands such as the footer.
 */
export function SignupForm({
  tone = "default",
  className,
}: {
  tone?: "default" | "inverse";
  className?: string;
}) {
  const t = useTranslations("Footer.Newsletter");
  const locale = useLocale();
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const fail = (code?: string) => {
    setStatus("error");
    setMessage(t(ERROR_KEYS[code ?? ""] ?? "errorMessage"));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeEmail(email);
    const { isValid, error } = validateEmail(normalized);
    if (!isValid) return fail(error);

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, locale }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return fail(data.error);

      setStatus("success");
      setMessage(t("subscribed"));
      setEmail("");
    } catch {
      fail();
    }
  }

  const inverse = tone === "inverse";

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("w-full max-w-md", className)}>
      <label htmlFor={inputId} className="sr-only">
        {t("emailLabel")}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={t("placeholder")}
          aria-invalid={status === "error"}
          aria-describedby={messageId}
          disabled={status === "loading"}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-md border px-3 text-base",
            inverse
              ? "border-white/25 bg-white/10 text-white placeholder:text-white/55"
              : "border-input bg-card text-foreground placeholder:text-muted-foreground"
          )}
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "h-11 px-5 text-base font-semibold",
            inverse && "bg-highlight text-highlight-foreground hover:bg-highlight/90"
          )}
        >
          {status === "loading" ? t("subscribing") : t("subscribe")}
        </Button>
      </div>
      <p
        id={messageId}
        role="status"
        aria-live="polite"
        className={cn(
          "mt-2 min-h-5 text-sm",
          status === "error" && (inverse ? "text-red-200" : "text-destructive"),
          status === "success" && (inverse ? "text-highlight" : "text-primary font-medium")
        )}
      >
        {status === "error" || status === "success" ? message : ""}
      </p>
    </form>
  );
}
