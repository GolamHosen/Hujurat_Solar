import { siteConfig } from "@/lib/site";

export interface CalendarEventDetails {
  title: string;
  description: string;
  location?: string;
  dateStr?: string; // YYYY-MM-DD
  timeSlot?: string; // e.g. "Morning (9:00 AM - 12:00 PM)"
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

/**
 * Parses a date string (YYYY-MM-DD) and an optional time slot into start and end Date objects.
 * Assumes Australian Eastern Time (AEST/AEDT, UTC+10/UTC+11) context for Sydney installations.
 */
export function parseEventDates(dateStr?: string, timeSlot?: string): { start: Date; end: Date } {
  const now = new Date();
  let baseDate = new Date();

  if (dateStr) {
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
    }
  } else {
    // Default to tomorrow 10:00 AM if no date provided
    baseDate.setDate(now.getDate() + 1);
  }

  let startHour = 10;
  let startMinute = 0;
  let durationHours = 1;

  if (timeSlot) {
    const lower = timeSlot.toLowerCase();
    if (lower.includes("morning") || lower.includes("9:00")) {
      startHour = 9;
      durationHours = 2;
    } else if (lower.includes("midday") || lower.includes("12:00")) {
      startHour = 12;
      durationHours = 2;
    } else if (lower.includes("afternoon") || lower.includes("3:00") || lower.includes("15:00")) {
      startHour = 15;
      durationHours = 2;
    }
  }

  const start = new Date(baseDate);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(start);
  end.setHours(start.getHours() + durationHours, start.getMinutes(), 0, 0);

  return { start, end };
}

/**
 * Formats a Date object into Google Calendar UTC format: YYYYMMDDTHHmmssZ
 */
function toUtcCompactIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

/**
 * Generates an official 1-click "Add to Google Calendar" link with pre-filled event details.
 */
export function createGoogleCalendarUrl(event: CalendarEventDetails): string {
  const { start, end } = parseEventDates(event.dateStr, event.timeSlot);
  const dates = `${toUtcCompactIso(start)}/${toUtcCompactIso(end)}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: event.description,
    location: event.location || siteConfig.address,
    sprop: `website:${siteConfig.url}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates a standard RFC 5545 iCalendar (.ics) string.
 * Compatible with Apple Calendar, Google Calendar, Outlook, and mobile calendar apps.
 */
export function createIcsCalendarContent(event: CalendarEventDetails): string {
  const { start, end } = parseEventDates(event.dateStr, event.timeSlot);
  const uid = `hujurat-solar-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@hujuratsolar.com.au`;
  const dtStamp = toUtcCompactIso(new Date());
  const dtStart = toUtcCompactIso(start);
  const dtEnd = toUtcCompactIso(end);

  const cleanDescription = event.description.replace(/\n/g, "\\n");
  const cleanSummary = event.title.replace(/\n/g, " ");
  const cleanLocation = (event.location || siteConfig.address).replace(/\n/g, ", ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hujurat Solar//Consultation Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    `ORGANIZER;CN="${siteConfig.name}":mailto:${siteConfig.email}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Hujurat Solar Consultation",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
