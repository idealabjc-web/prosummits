// Script to auto-generate slugs for events that are missing them
// Run with: node scripts/patch-slugs.mjs

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'gmr7l147',
  dataset: 'production',
  apiVersion: '2024-03-11',
  // We need a write token — using the same token as the CLI would use
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

function toSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric
    .replace(/[\s]+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .slice(0, 96)
}

async function patchMissingSlugs() {
  const events = await client.fetch(
    `*[_type == "event" && !defined(slug.current)]{ _id, title }`
  )

  if (events.length === 0) {
    console.log('✅ All events already have slugs!')
    return
  }

  console.log(`Found ${events.length} events without slugs. Patching...`)

  for (const event of events) {
    const slugValue = toSlug(event.title)
    await client
      .patch(event._id)
      .set({ slug: { _type: 'slug', current: slugValue } })
      .commit()
    console.log(`✅ ${event.title} → /events/${slugValue}`)
  }

  console.log('\n🎉 All slugs generated and saved!')
}

patchMissingSlugs().catch(console.error)
