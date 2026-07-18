import { parseISO, formatDistanceToNow, isValid } from 'date-fns';

/**
 * Safely parses an ISO date string, handling empty strings and invalid dates
 */
export function safeParseISO(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? parsed : null;
}

/**
 * Safely formats a distance to now, handling invalid dates
 */
export function safeFormatDistance(dateStr: string | null | undefined, options?: any): string {
  const date = safeParseISO(dateStr);
  if (!date) return 'Unknown';
  try {
    return formatDistanceToNow(date, options);
  } catch (e) {
    return 'Unknown';
  }
}

/**
 * Sanitizes a string for CSV export to prevent formula injection
 */
export function sanitizeForCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const strValue = String(value);
  // If starts with =, +, -, or @, prefix with a single quote
  if (/^[=+\-@]/.test(strValue)) {
    return `'${strValue}`;
  }
  return strValue;
}
