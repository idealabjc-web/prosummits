import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "gmr7l147",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-11",
});

async function main() {
  const data = await client.fetch(`*[_type == "event"]{ _id, title, date, location, "year": eventYear->year, badge }`);
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
