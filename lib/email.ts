const DISPOSABLE_EMAIL_DOMAINS = [
  "tempmail.com",
  "throwawaymail.com",
  "tempmail100.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "yopmail.com",
];

export type EmailValidationError =
  | "invalid_email_format"
  | "email_part_too_long"
  | "disposable_email_not_allowed";

// Local part: letters, digits and . _ % + - (no leading, trailing or double dots).
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]{1,64}(?<!\.)@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

export function validateEmail(email: string): {
  isValid: boolean;
  error?: EmailValidationError;
} {
  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "invalid_email_format" };
  }

  const [localPart, domain] = email.split("@");
  if (domain.length > 255 || localPart.length > 64) {
    return { isValid: false, error: "email_part_too_long" };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain.toLowerCase())) {
    return { isValid: false, error: "disposable_email_not_allowed" };
  }

  return { isValid: true };
}

/**
 * Trims and lowercases an address. Deliberately does NOT strip dots or
 * "+tags": rewriting the address can send mail to a different person
 * (e.g. mary-jane@yahoo.com is not mary@yahoo.com).
 */
export function normalizeEmail(email: string): string {
  return (email || "").trim().toLowerCase();
}
