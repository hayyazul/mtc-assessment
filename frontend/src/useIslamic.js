// useIslamic.js
// Converts Gregorian <-> Hijri and provides Hijri month navigation.

export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

// Convert a Gregorian Date to a Hijri date object { day, month, monthName, year }
export function toHijri(date) {
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);
  const get = (type) => parseInt(parts.find((p) => p.type === type).value);

  const month = get("month");
  return {
    day:       get("day"),
    month,
    monthName: HIJRI_MONTHS[month - 1],
    year:      get("year"),
  };
}

// Given a Hijri { month, year }, return the first and last Gregorian Date
// of that Hijri month by scanning days until the month changes.
export function getHijriMonthBounds(hijriMonth, hijriYear) {
  // Find the first Gregorian day of this Hijri month.
  // Strategy: start from an approximate Gregorian date and scan forward/back.

  // Rough estimate: each Hijri year is ~354 days, starts ~622 CE
  const approxGregorianYear = Math.floor(hijriYear * 354.367 / 365.25) + 622;
  const approxGregorianMonth = ((hijriMonth - 1) * 29.5) / 365 * 12;
  let cursor = new Date(approxGregorianYear, Math.floor(approxGregorianMonth), 1);

  // Walk forward/backward until we're inside the right Hijri month
  let h = toHijri(cursor);
  while (h.year < hijriYear || (h.year === hijriYear && h.month < hijriMonth)) {
    cursor = addDays(cursor, 1);
    h = toHijri(cursor);
  }
  while (h.year > hijriYear || (h.year === hijriYear && h.month > hijriMonth)) {
    cursor = addDays(cursor, -1);
    h = toHijri(cursor);
  }

  // Walk back to the 1st of the Hijri month
  while (toHijri(addDays(cursor, -1)).month === hijriMonth &&
         toHijri(addDays(cursor, -1)).year === hijriYear) {
    cursor = addDays(cursor, -1);
  }

  const firstDay = new Date(cursor);

  // Walk forward to the last day of the Hijri month
  let last = new Date(cursor);
  while (true) {
    const next = addDays(last, 1);
    const nextH = toHijri(next);
    if (nextH.month !== hijriMonth || nextH.year !== hijriYear) break;
    last = next;
  }

  return { firstGregorian: firstDay, lastGregorian: last };
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}