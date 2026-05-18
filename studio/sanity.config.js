import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'ProSummits Live',

  projectId: 'gmr7l147',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: [
      {
        name: 'event',
        title: 'Event',
        type: 'document',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
          { name: 'date', type: 'string', title: 'Date' },
          { name: 'location', type: 'string', title: 'Location' },
          { name: 'type', type: 'string', title: 'Type', options: { list: ['🌍 Hybrid', '💻 Online'] } },
          { name: 'badge', type: 'string', title: 'Badge' },
          { name: 'bdColor', type: 'string', title: 'Badge Color (Hex)' },
          { name: 'dateColor', type: 'string', title: 'Date Color (Hex)' },
          { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
          { name: 'chips', type: 'array', title: 'Chips/Tags', of: [{ type: 'string' }] },
          {
            name: 'themes',
            title: 'Conference Themes',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'icon', type: 'string', title: 'Icon (Emoji)', initialValue: '🎯' },
                { name: 'title', type: 'string', title: 'Theme Title' },
                { name: 'description', type: 'text', title: 'Short Description' },
              ],
              preview: {
                select: { title: 'title', subtitle: 'description' },
              }
            }],
            description: 'Key themes for this specific event/conference.'
          },
          { name: 'legacyImageUrl', type: 'url', title: 'Legacy Image URL' },
          // { name: 'price', type: 'string', title: 'Price', initialValue: 'Free' },
          {
            name: 'eventYear',
            type: 'reference',
            title: 'Conference Year',
            to: [{ type: 'eventYear' }],
            description: 'Select the yearly series this event belongs to (e.g. 2026 Conferences)'
          },
          {
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [{ type: 'block' }]
          },
          {
            name: 'aboutImage',
            title: 'About Section Image',
            type: 'image',
            options: { hotspot: true }
          }
        ]
      },
      {
        name: 'sponsor',
        title: 'Sponsor',
        type: 'document',
        fields: [
          { name: 'name', type: 'string', title: 'Sponsor Name' },
          { name: 'image', type: 'image', title: 'Logo', options: { hotspot: true } },
          { name: 'legacyImageUrl', type: 'url', title: 'Legacy Image URL' }
        ]
      },
      {
        name: 'speaker',
        title: 'Speaker / Ambassador',
        type: 'document',
        fields: [
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'role', type: 'string', title: 'Role' },
          { name: 'location', type: 'string', title: 'Location' },
          { name: 'image', type: 'image', title: 'Profile Image', options: { hotspot: true } },
          { name: 'legacyImageUrl', type: 'url', title: 'Legacy Image URL' },
          { name: 'initials', type: 'string', title: 'Initials' }
        ]
      },
      {
        name: 'testimonial',
        title: 'Testimonial',
        type: 'document',
        fields: [
          { name: 'quote', type: 'text', title: 'Quote' },
          { name: 'author', type: 'string', title: 'Author Name' },
          { name: 'role', type: 'string', title: 'Author Role' }
        ]
      },
      {
        name: 'faq',
        title: 'FAQ',
        type: 'document',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' },
          { name: 'category', type: 'string', title: 'Category', options: { list: ['General', 'Events & Attendance', 'Speakers & Content', 'Partnerships & Sponsorship', 'Policies'] } }
        ]
      },
      {
        name: 'organizer',
        title: 'Organizer / Partner',
        type: 'document',
        fields: [
          { name: 'icon', type: 'string', title: 'Icon (Emoji)' },
          { name: 'name', type: 'string', title: 'Partner Name' },
          { name: 'description', type: 'text', title: 'Description' }
        ]
      },
      {
        name: 'siteSettings',
        title: 'Site Settings',
        type: 'document',
        fields: [
          { name: 'title', type: 'string', title: 'Site Title', initialValue: 'ProSummits' },
          {
            name: 'marqueeItems', type: 'array', title: 'Marquee Items', of: [
              {
                type: 'object', fields: [
                  { name: 'text', type: 'string' },
                  { name: 'color', type: 'string' }
                ]
              }
            ]
          },
          {
            name: 'heroStats', type: 'array', title: 'Hero Stats', of: [
              {
                type: 'object', fields: [
                  { name: 'number', type: 'string' },
                  { name: 'label', type: 'string' },
                  { name: 'color', type: 'string' }
                ]
              }
            ]
          },
          {
            name: 'gmailUser',
            type: 'string',
            title: 'Gmail User',
            description: 'The email address to send from (e.g., prosummitsvirtual@gmail.com)'
          },
          {
            name: 'gmailAppPassword',
            type: 'string',
            title: 'Gmail App Password',
            description: 'The 16-character Google App Password'
          }
        ]
      },
      {
        name: 'eventYear',
        title: 'Conference Year',
        type: 'document',
        fields: [
          { name: 'year', type: 'string', title: 'Year (e.g. 2026)' },
          { name: 'title', type: 'string', title: 'Card Title' },
          { name: 'subtitle', type: 'string', title: 'Card Subtitle' },
          { name: 'description', type: 'text', title: 'Short Description' },
          { name: 'about', title: 'About the Series', type: 'array', of: [{ type: 'block' }] },
          {
            name: 'aboutImage',
            title: 'About Section Image',
            type: 'image',
            options: { hotspot: true }
          },
          { name: 'image', type: 'image', title: 'Card Image', options: { hotspot: true } },
          { name: 'accentColor', type: 'string', title: 'Accent Color (Hex)', initialValue: '#F47B20' },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
          {
            name: 'events',
            title: 'Events in this Series',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'event' }] }],
            description: 'Manually select and order the events that belong to this yearly series.'
          }
        ]
      },
      {
        name: 'series',
        title: 'Event Series',
        type: 'document',
        fields: [
          { name: 'name', title: 'Series Name', type: 'string' },
          { name: 'year', title: 'Year', type: 'number' },
          {
            name: 'events',
            title: 'Events in Series',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'event' }] }],
            description: 'Manually select and order the events that belong to this yearly series.'
          }
        ]
      },
      {
        name: 'gallery',
        title: 'ProSummits Gallery',
        type: 'document',
        fields: [
          {
            name: 'images',
            title: 'Gallery Images',
            type: 'array',
            of: [
              {
                type: 'object',
                name: 'galleryImage',
                title: 'Gallery Image',
                fields: [
                  { name: 'image', type: 'image', title: 'Upload Image', options: { hotspot: true } },
                  { name: 'url', type: 'url', title: 'External URL (Fallback)' },
                  {
                    name: 'category',
                    type: 'string',
                    title: 'Category',
                    initialValue: 'Conference Highlights',
                    options: {
                      list: [
                        { title: 'Highlights', value: 'Speakers' },
                        { title: 'Panel Discussions', value: 'Panels' },
                        { title: 'Global Venues', value: 'Locations' },
                        { title: 'Speakers', value: 'Highlights' }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
  },
})
