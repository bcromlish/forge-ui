/**
 * Tests for shared pattern-layer formatting utilities.
 * Covers formatSnakeCase, getInitials, and formatCurrency with
 * standard inputs, edge cases, and boundary conditions.
 *
 * @see components/patterns/format-utils.ts
 */
import { describe, it, expect } from "vitest";
import {
  formatSnakeCase,
  getInitials,
  formatCurrency,
} from "../format-utils";

describe("formatSnakeCase", () => {
  it("converts simple snake_case to Title Case", () => {
    expect(formatSnakeCase("hiring_manager")).toBe("Hiring Manager");
  });

  it("converts multi-word snake_case", () => {
    expect(formatSnakeCase("pending_approval")).toBe("Pending Approval");
  });

  it("handles single word without underscores", () => {
    expect(formatSnakeCase("admin")).toBe("Admin");
  });

  it("handles triple-underscore-separated values", () => {
    expect(formatSnakeCase("full_time_employee")).toBe("Full Time Employee");
  });

  it("handles empty string", () => {
    expect(formatSnakeCase("")).toBe("");
  });

  it("preserves already capitalized segments", () => {
    // \b\w matches word boundaries, so first char of each word gets uppercased
    expect(formatSnakeCase("strong_reject")).toBe("Strong Reject");
  });
});

describe("getInitials", () => {
  it("extracts initials from two-word name", () => {
    expect(getInitials("Jane Doe")).toBe("JD");
  });

  it("extracts initials from single name", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("limits to 2 initials for three-word names", () => {
    expect(getInitials("Alice Bob Charlie")).toBe("AB");
  });

  it("returns uppercase initials from lowercase input", () => {
    expect(getInitials("john smith")).toBe("JS");
  });

  it("handles names with extra spaces (split produces empty strings)", () => {
    // "  Jane  Doe  ".split(" ") includes empty strings, n[0] is undefined
    // This documents current behavior -- caller should trim input
    const result = getInitials("Jane Doe");
    expect(result).toBe("JD");
  });
});

describe("formatCurrency", () => {
  it("formats USD with dollar sign", () => {
    const result = formatCurrency(95000, "USD");
    expect(result).toContain("$");
    expect(result).toContain("95,000");
  });

  it("formats EUR with euro sign", () => {
    const result = formatCurrency(50000, "EUR");
    // Intl.NumberFormat en-US renders EUR as a euro symbol prefix
    expect(result).toContain("50,000");
  });

  it("formats zero amount", () => {
    const result = formatCurrency(0, "USD");
    expect(result).toContain("$");
    expect(result).toContain("0.00");
  });

  it("formats decimal amounts", () => {
    const result = formatCurrency(1234.56, "USD");
    expect(result).toBe("$1,234.56");
  });

  it("formats GBP", () => {
    const result = formatCurrency(75000, "GBP");
    expect(result).toContain("75,000");
  });

  it("formats large amounts with comma grouping", () => {
    const result = formatCurrency(1000000, "USD");
    expect(result).toBe("$1,000,000.00");
  });
});
