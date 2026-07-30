import { createClient } from "@sanity/client";
import { parseEventDate } from "../src/lib/utils.js";

const client = createClient({
  projectId: "gmr7l147",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-11",
});

async function main() {
  const data = await client.fetch(`*[_type == "event"]{ _id, title, date, "year": eventYear->year }`);
  console.log("Total events fetched:", data.length);
  
  const parsed = data.map(e => ({
    id: e._id,
    title: e.title,
    dateStr: e.date,
    year: e.year,
    timestamp: parseEventDate(e.date, e.year),
    dateObj: new Date(parseEventDate(e.date, e.year)).toDateString()
  }));

  parsed.sort((a, b) => a.timestamp - b.timestamp);

  console.log("\n--- All Events Sorted Chronologically ---");
  parsed.forEach(e => {
    console.log(`${e.dateObj} | "${e.dateStr}" | ${e.title}`);
  });
}

main().catch(console.error);
