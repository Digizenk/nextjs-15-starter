import { normalizeEmail, validateEmail } from "@/lib/email";
import { createUnsubscribeToken, verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { siteConfig } from "@/config/site";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { Resend } from "resend";

/** Thrown when the email service keys haven't been added to .env yet. */
export class NewsletterNotConfiguredError extends Error {
  constructor() {
    super("Newsletter is not configured. Add RESEND_API_KEY and ADMIN_EMAIL to .env.");
  }
}

/** Thrown for problems the visitor can fix (bad address, too many tries). */
export class NewsletterInputError extends Error {}

// Clients are created on first use, not at import time, so the site still
// builds and runs before the email/rate-limit keys are added.
let resend: Resend | null = null;
function getResend(): Resend {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    throw new NewsletterNotConfiguredError();
  }
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

let limiter: Ratelimit | null | undefined;
function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  limiter =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(parseInt(process.env.DAY_MAX_SUBMISSIONS || "10"), "1d"),
          prefix: process.env.UPSTASH_REDIS_NEWSLETTER_RATE_LIMIT_KEY || "newsletter-rate-limit",
        })
      : null;
  return limiter;
}

async function checkRateLimit() {
  const rateLimiter = getLimiter();
  if (!rateLimiter) return; // rate limiting is optional until Upstash is set up

  const headersList = await headers();
  const ip =
    headersList.get("x-real-ip") ||
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  const { success } = await rateLimiter.limit(ip);
  if (!success) {
    throw new NewsletterInputError("too_many_requests");
  }
}

function welcomeEmail(locale: string, unsubscribeLink: string) {
  const packUrl = process.env.FREE_PACK_URL;
  const es = locale === "es";

  const subject = es ? "Tu paquete de 25 prompts gratis" : "Your 25 free prompts";
  const intro = es
    ? "Gracias por suscribirte. Aquí tienes tu paquete de 25 prompts de IA para pequeños negocios."
    : "Thanks for signing up. Here's your pack of 25 AI prompts for small businesses.";
  const button = es ? "Descargar el paquete" : "Download the pack";
  const pending = es
    ? "Te enviaremos el enlace de descarga muy pronto."
    : "We'll send your download link very shortly.";
  const outro = es
    ? "De vez en cuando te escribiremos cuando publiquemos guías nuevas."
    : "Every so often we'll write when new guides are published.";
  const unsubscribe = es ? "Darte de baja" : "Unsubscribe";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1B1F3B; max-width: 520px;">
      <h2 style="margin: 0 0 16px;">${subject}</h2>
      <p>${intro}</p>
      ${
        packUrl
          ? `<p style="margin: 24px 0;"><a href="${packUrl}" style="background: #0F6E62; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">${button}</a></p>`
          : `<p>${pending}</p>`
      }
      <p>${outro}</p>
      <p style="margin-top: 32px; font-size: 12px; color: #5B6077;">
        <a href="${unsubscribeLink}" style="color: #5B6077;">${unsubscribe}</a>
      </p>
    </div>
  `;

  return { subject, html };
}

export async function subscribeToNewsletter(rawEmail: string, locale = "en") {
  const client = getResend();
  await checkRateLimit();

  const email = normalizeEmail(rawEmail);
  const { isValid, error } = validateEmail(email);
  if (!isValid) {
    throw new NewsletterInputError(error || "invalid_email_format");
  }

  if (process.env.RESEND_AUDIENCE_ID) {
    await client.contacts.create({
      audienceId: process.env.RESEND_AUDIENCE_ID,
      email,
    });
  }

  const unsubscribeLink = `${siteConfig.url}${locale === "en" ? "" : `/${locale}`}/unsubscribe?token=${createUnsubscribeToken(email)}`;
  const { subject, html } = welcomeEmail(locale, unsubscribeLink);

  const { error: sendError } = await client.emails.send({
    from: `${siteConfig.name} <${process.env.ADMIN_EMAIL}>`,
    to: email,
    subject,
    html,
    headers: {
      "List-Unsubscribe": `<${unsubscribeLink}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (sendError) {
    throw new Error(`Resend send failed: ${sendError.message}`);
  }

  return { success: true };
}

export type UnsubscribeResult =
  | { success: true; email: string }
  | { success: false; reason: "invalid_token" | "error" };

export async function unsubscribeFromNewsletter(token: string): Promise<UnsubscribeResult> {
  try {
    const email = verifyUnsubscribeToken(token);
    if (!email) {
      return { success: false, reason: "invalid_token" };
    }

    const client = getResend();
    if (process.env.RESEND_AUDIENCE_ID) {
      await client.contacts.remove({
        audienceId: process.env.RESEND_AUDIENCE_ID,
        email,
      });
    }
    return { success: true, email };
  } catch (error) {
    console.error("Newsletter unsubscribe failed:", error);
    return { success: false, reason: "error" };
  }
}
