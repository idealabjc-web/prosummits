import { createClient } from "@sanity/client";
import { parseEventDate, sortEventsByDate } from "../src/lib/utils.js";

const client = createClient({
  projectId: "gmr7l147",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-11",
});

async function main() {
  const data = await client.fetch(`*[_type == "event"]{ ..., slug, eventYear-> }`);
  console.log("Fetched raw count:", data.length);

  // Filter 2026 and 2027 events
  const nov2026Cutoff = new Date(2026, 10, 1).getTime(); // Nov 1, 2026
  const filtered = data.filter(e => {
    const t = parseEventDate(e.date, e.eventYear?.year);
    // Include 2026 and 2027 events starting from Nov 2026
    return t >= nov2026Cutoff;
  });

  const sorted = sortEventsByDate(filtered);
  console.log("\n--- Sorted upcoming from Nov 2026 ---");
  sorted.slice(0, 10).forEach((e, i) => {
    console.log(`${i+1}. [${e.date}] (${e.location}) - ${e.title}`);
  });
}

main().catch(console.error);
