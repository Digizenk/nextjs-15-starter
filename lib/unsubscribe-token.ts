import { createHmac, timingSafeEqual } from "crypto";

/**
 * Unsubscribe links carry the email plus an HMAC signature, so nobody can
 * unsubscribe someone else just by knowing their address.
 */
function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY;
  if (!secret) {
    throw new Error("UNSUBSCRIBE_SECRET is not set");
  }
  return secret;
}

function sign(email: string): string {
  return createHmac("sha256", getSecret()).update(email).digest("base64url");
}

export function createUnsubscribeToken(email: string): string {
  return `${Buffer.from(email).toString("base64url")}.${sign(email)}`;
}

/** Returns the email if the token is genuine, otherwise null. */
export function verifyUnsubscribeToken(token: string): string | null {
  const [encodedEmail, signature] = (token || "").split(".");
  if (!encodedEmail || !signature) return null;

  const email = Buffer.from(encodedEmail, "base64url").toString();
  const expected = Buffer.from(sign(email));
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }
  return email;
}
