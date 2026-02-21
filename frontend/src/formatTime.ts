// formatTime.ts
export function formatTime12h(timeStr: string | null): string {
  if (!timeStr) return "";
  const parts = timeStr.match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)?/i);
  if (!parts) return timeStr;
  let hours = parseInt(parts[1], 10);
  const minutes = parseInt(parts[2], 10);
  const existingMeridiem = parts[4];

  // Already 12h
  if (existingMeridiem) {
    return `${hours}:${String(minutes).padStart(2, "0")} ${existingMeridiem.toUpperCase()}`;
  }

  // Convert from 24h
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}