import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "gmr7l147",
  dataset: "production",
  useCdn: false, // `false` if you want to ensure fresh data every time
  apiVersion: "2024-03-11",
});

const builder = imageUrlBuilder(client);

/**
 * Helper to build image URLs from Sanity assets
 * Usage: urlFor(doc.image).width(200).url()
 */
export const urlFor = (source) => builder.image(source);
