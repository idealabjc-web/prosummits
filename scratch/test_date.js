const monthNames = {
  january: 0, jan: 0,
  february: 1, feb: 1,
  march: 2, mar: 2,
  april: 3, apr: 3,
  may: 4,
  june: 5, jun: 5,
  july: 6, jul: 6,
  august: 7, aug: 7,
  september: 8, sep: 8, sept: 8,
  october: 9, oct: 9,
  november: 10, nov: 10,
  december: 11, dec: 11
};

export function parseEventDate(dateStr, yearFallback) {
  if (!dateStr || typeof dateStr !== "string") return Infinity;

  let str = dateStr.trim();

  // 1. Clean range hyphens/dashes between numbers first:
  // e.g. "March 08-09, 2027" -> "March 08, 2027"
  // e.g. "July 20–23, 2026" -> "July 20, 2026"
  let cleaned = str.replace(/\b(\d+)\s*[-–—]\s*\d+\b/, "$1");

  // 2. Try parsing cleaned string with explicit Month Day Year extraction if possible
  // Match e.g. "March 08, 2027", "July 20 2026", "Nov 12, 2026"
  const m = cleaned.match(/([a-zA-Z]+)\s+(\d+)(?:,?\s*(\d{4}))?/);
  if (m) {
    const monthStr = m[1].toLowerCase();
    const day = parseInt(m[2], 10);
    const yearStr = m[3] || (str.match(/\b(20\d\d)\b/)?.[1]) || (yearFallback ? String(yearFallback) : null);

    if (monthNames[monthStr] !== undefined && !isNaN(day) && yearStr) {
      const year = parseInt(yearStr, 10);
      return new Date(year, monthNames[monthStr], day).getTime();
    }
  }

  // 3. Direct parse attempt on cleaned string
  let timestamp = Date.parse(cleaned);
  if (!isNaN(timestamp)) return timestamp;

  // 4. Extract year fallback if present
  let yearMatch = str.match(/\b(20\d\d)\b/);
  let year = yearMatch ? yearMatch[1] : (yearFallback ? String(yearFallback) : "");

  if (year) {
    return new Date(parseInt(year, 10), 0, 1).getTime();
  }

  return Infinity;
}

const testDates = [
  "September 08–10, 2027",
  "March 08-09, 2027",
  "November 12-13, 2026",
  "July 20–23, 2026",
  "July 20-23, 2026",
  "May 10–11, 2027"
];

const items = testDates.map(d => ({ date: d, time: parseEventDate(d), dateObj: new Date(parseEventDate(d)).toDateString() }));
items.sort((a, b) => a.time - b.time);

console.log(items);
