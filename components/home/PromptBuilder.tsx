"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useId, useMemo, useState } from "react";

type Niche = { id: string; label: string; niche: string; audience: string; tone: string };
type Goal = { id: string; label: string; template: string };
type SlotKey = "niche" | "audience" | "tone";

function ChoiceGroup<T extends { id: string; label: string }>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: T[];
  value: string;
  onChange: (id: string) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-sm font-medium text-muted-foreground">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = option.id === value;
          return (
            <label
              key={option.id}
              className={cn(
                "cursor-pointer select-none rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                checked
                  ? "border-foreground bg-foreground text-background"
                  : "border-input bg-card text-foreground hover:border-foreground/50"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Interactive sample prompt: pick a business and a job, copy the result. */
export function PromptBuilder() {
  const t = useTranslations("Home.demo");
  const niches = t.raw("niches") as Niche[];
  const goals = t.raw("goals") as Goal[];

  const [nicheId, setNicheId] = useState(niches[0].id);
  const [goalId, setGoalId] = useState(goals[0].id);
  const [copied, setCopied] = useState(false);

  const niche = niches.find((n) => n.id === nicheId) ?? niches[0];
  const goal = goals.find((g) => g.id === goalId) ?? goals[0];

  const parts = useMemo(
    () =>
      goal.template.split(/(\{niche\}|\{audience\}|\{tone\})/).map((part) => {
        const key = part.match(/^\{(niche|audience|tone)\}$/)?.[1] as SlotKey | undefined;
        return key ? { slot: true, text: niche[key] } : { slot: false, text: part };
      }),
    [goal, niche]
  );
  const plainText = parts.map((p) => p.text).join("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the text stays selectable.
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_hsl(var(--border)),0_12px_32px_-16px_hsl(233_37%_17%/0.25)] sm:p-6">
      <h2 className="sr-only">{t("label")}</h2>
      <div className="space-y-4">
        <ChoiceGroup legend={t("businessLabel")} options={niches} value={nicheId} onChange={setNicheId} />
        <ChoiceGroup legend={t("goalLabel")} options={goals} value={goalId} onChange={setGoalId} />
      </div>

      <div className="mt-5 rounded-lg bg-background p-4 sm:p-5">
        <p
          className="font-mono text-[0.95rem] leading-[1.75] text-foreground"
          aria-live="polite"
        >
          {parts.map((part, i) =>
            part.slot ? (
              <mark key={i} className="prompt-slot">
                {part.text}
              </mark>
            ) : (
              <Fragment key={i}>{part.text}</Fragment>
            )
          )}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-snug text-muted-foreground sm:max-w-xs">{t("hint")}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-foreground px-4 text-sm font-semibold hover:bg-foreground hover:text-background"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
        </button>
      </div>
    </div>
  );
}
