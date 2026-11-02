import {
  NewsletterInputError,
  NewsletterNotConfiguredError,
  subscribeToNewsletter,
} from "@/actions/newsletter";
import { LOCALES } from "@/i18n/routing";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { email?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ error: "invalid_email_format" }, { status: 400 });
  }
  const locale = body.locale && LOCALES.includes(body.locale) ? body.locale : "en";

  try {
    const result = await subscribeToNewsletter(body.email, locale);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NewsletterInputError) {
      const status = error.message === "too_many_requests" ? 429 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
    if (error instanceof NewsletterNotConfiguredError) {
      console.error(error.message);
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    console.error("Newsletter subscription failed:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
