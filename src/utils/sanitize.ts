// Remove dangerous HTML/script injection
export function sanitize(input: string): string {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

// Sanitize entire form object
export function sanitizeForm<T extends Record<string, unknown>>(form: T): T {
  const clean = { ...form };
  for (const key in clean) {
    if (typeof clean[key] === "string") {
      (clean as Record<string, unknown>)[key] = sanitize(clean[key] as string);
    }
  }
  return clean;
}

// Validate PR number format
export function isValidPRNumber(id: string): boolean {
  return /^PR-\d{4}-\d{4,6}$/.test(id);
}

// Validate SAR amount
export function isValidAmount(amount: number): boolean {
  return !isNaN(amount) && amount >= 0 && amount < 1_000_000_000;
}
