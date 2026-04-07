/**
 * Shared formatting utilities for pattern-layer components.
 * Centralizes display formatting that was previously duplicated across
 * multiple card and table compositions (CandidateCard, OfferCard, MembersTable, etc.).
 *
 * Import rule: only lib/utils allowed -- no imports from primitives/, compositions/, hooks/, or types/.
 */

/**
 * Converts a snake_case string to Title Case for display.
 * Replaces underscores with spaces and capitalizes each word.
 *
 * @example formatSnakeCase("hiring_manager") => "Hiring Manager"
 */
export function formatSnakeCase(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extracts up to 2 initials from a full name for avatar fallbacks.
 * Returns uppercase initials from the first letter of each word.
 *
 * @example getInitials("Jane Doe") => "JD"
 * @example getInitials("Alice Bob Charlie") => "AB"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Formats a numeric amount as locale-aware currency using Intl.NumberFormat.
 * Defaults to en-US formatting; currency code must be ISO 4217 (e.g., "USD", "EUR").
 *
 * @example formatCurrency(95000, "USD") => "$95,000.00"
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );
}
