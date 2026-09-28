/**
 * Formatting helpers.
 *
 * `Intl.DateTimeFormat` covers everything this site needs, so no date library is added.
 * All dates cross the data layer as ISO strings and are formatted only at render time.
 */

const LOCALE = "en-AU";

/** "24 Sep 2026" — list/card dates. Returns "" for missing values. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });
}

/** "24 September 2026" — detail pages. */
export function formatLongDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
}

/** `formatMeasure(13.2, "kW")` -> "13.2 kW"; returns null when there is no value. */
export function formatMeasure(value: number | null | undefined, unit: string): string | null {
  if (value === null || value === undefined) return null;
  const rounded = Math.round(value * 10) / 10;
  return `${rounded} ${unit}`;
}

/** Same as formatMeasure, without a space — matches the existing "13.2kW" card style. */
export function formatMeasureCompact(value: number | null | undefined, unit: string): string | null {
  if (value === null || value === undefined) return null;
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}${unit}`;
}

/** Average of a numeric list, or 0 for an empty list. */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}
