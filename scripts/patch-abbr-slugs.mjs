// Script to generate abbreviation-style slugs for all events
// Pattern: ABBR-TYPE-YEAR (e.g., QGWL-SUMMIT-2026)
// Run: node scripts/patch-abbr-slugs.mjs

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'gmr7l147',
  dataset: 'production',
  apiVersion: '2024-03-11',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

// Words to skip when building abbreviation
const SKIP = new Set(['of', 'in', 'the', 'a', 'an', 'for', 'with', 'to', 'by', 'at', 'and', 's'])

// Event type words → their slug label
const TYPE_MAP = {
  summit: 'summit',
  congress: 'congress',
  forum: 'forum',
  conference: 'conf',
}

function getWordAbbr(word) {
  // Pure acronyms like AI, HER, SHE → keep as-is
  if (/^[A-Z]{2,}$/.test(word)) return word

  // CamelCase/PascalCase compound words: NextGen→NG, FutureHER→F+HER, InnerGlow→IG, MindRise→MR
  if (/[a-z][A-Z]/.test(word)) {
    const parts = word.replace(/([a-z])([A-Z])/g, '$1|$2').split('|')
    return parts.map(p => /^[A-Z]{2,}$/.test(p) ? p : p[0].toUpperCase()).join('')
  }

  // ElevateHER → EH (starts uppercase, has embedded uppercase)
  if (/^[A-Z][a-z]+[A-Z]/.test(word)) {
    const parts = word.replace(/([a-z])([A-Z])/g, '$1|$2').split('|')
    return parts.map(p => /^[A-Z]{2,}$/.test(p) ? p : p[0].toUpperCase()).join('')
  }

  // Regular word → first letter uppercase
  return word[0].toUpperCase()
}

function generateAbbrSlug(title) {
  // Extract year
  const yearMatch = title.match(/\b(20\d{2})\b/)
  const year = yearMatch ? yearMatch[1] : null

  // Extract ordinal prefix like 7th, 8th (put at end)
  const ordinalMatch = title.match(/^(\d+(?:st|nd|rd|th))\s+/i)
  const ordinal = ordinalMatch ? ordinalMatch[1].toUpperCase() : null

  // Clean title: remove year, ordinal prefix, punctuation
  let clean = title
    .replace(/\b20\d{2}\b/, '')
    .replace(/^\d+(?:st|nd|rd|th)\s+/i, '')
    .replace(/[',.,]/g, '')
    .trim()

  // Split on spaces and & 
  const words = clean.split(/[\s&]+/).filter(w => w.length > 0)

  let typeLabel = null
  const abbrParts = []

  for (const word of words) {
    const lower = word.toLowerCase()

    if (TYPE_MAP[lower]) {
      typeLabel = TYPE_MAP[lower].toUpperCase()
      continue
    }
    if (SKIP.has(lower)) continue

    abbrParts.push(getWordAbbr(word))
  }

  // Cap abbreviation at 4 parts to keep it short
  const abbr = abbrParts.slice(0, 4).join('')
  const type = typeLabel || 'EVENT'

  const parts = []
  if (ordinal) parts.push(ordinal)
  parts.push(abbr)
  parts.push(type)
  if (year) parts.push(year)

  return parts.join('-').toLowerCase()
}

// ── Preview all slugs first ──────────────────────────────────────────────────
const SKIP_TITLE = 'Test Deterministic ID Event'

async function run() {
  const events = await client.fetch(
    `*[_type == "event" && title != $skip]{ _id, title } | order(title asc)`,
    { skip: SKIP_TITLE }
  )

  console.log('\n📋 Preview of new abbreviation slugs:\n')
  console.log('─'.repeat(80))

  const patches = []
  for (const ev of events) {
    const slug = generateAbbrSlug(ev.title)
    console.log(`  ${ev.title}`)
    console.log(`  → /events/${slug}\n`)
    patches.push({ id: ev._id, slug })
  }

  console.log('─'.repeat(80))
  console.log(`\nPatching ${patches.length} events...\n`)

  for (const { id, slug } of patches) {
    await client
      .patch(id)
      .set({ slug: { _type: 'slug', current: slug } })
      .commit()
    console.log(`  ✅ → /events/${slug}`)
  }

  console.log('\n🎉 All abbreviation slugs saved!')
}

run().catch(console.error)
