import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEventStatus(dateStr: string): 'Upcoming' | 'Completed' {
  try {
    // 1. Remove ordinal suffixes (st, nd, rd, th) from the day (max 2 digits to prevent ReDoS)
    // e.g., "15th Jan 2024" -> "15 Jan 2024"
    let cleanedDate = dateStr.replace(/(\d{1,2})(?:st|nd|rd|th)/i, '$1');

    let eventDate = new Date(cleanedDate);

    // 2. Handle DD-MM-YYYY or DD/MM/YYYY if native parsing failed
    if (isNaN(eventDate.getTime())) {
      // Try to match DD-MM-YYYY or DD/MM/YYYY
      const parts = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
      if (parts) {
        // parts[1] = Day, parts[2] = Month, parts[3] = Year
        // Month is 0-indexed in JS Date constructor (0 = Jan, 11 = Dec)
        eventDate = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]));
      }
    }

    // If still invalid, default to Upcoming (safer fallback)
    if (isNaN(eventDate.getTime())) return 'Upcoming';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventDate.getTime() >= today.getTime() ? 'Upcoming' : 'Completed';
  } catch {
    return 'Upcoming';
  }
}

export function ensureAbsoluteUrl(url: string | undefined): string {
  if (!url) return 'javascript:void(0)';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}
