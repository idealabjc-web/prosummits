import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'ProSummits Live',

  projectId: 'gmr7l147',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Blog section
            S.listItem()
              .title('✍️ Blog Posts')
              .id('post')
              .child(
                S.documentTypeList('post')
                  .title('Blog Posts')
              ),
            S.divider(),
            // Gallery section (shows existing document)
            S.listItem()
              .title('🖼️ Gallery')
              .id('gallery')
              .child(
                S.documentTypeList('gallery')
                  .title('Gallery')
              ),
            S.divider(),
            S.listItem()
              .title('Registration & Pricing')
              .id('registrationSettings')
              .child(
                S.document()
                  .schemaType('registrationSettings')
                  .documentId('registrationSettings')
                  .title('Registration & Pricing')
              ),
            S.divider(),
            // All other document types (auto-generated)
            ...S.documentTypeListItems().filter(
              (item) => !['gallery', 'post', 'registrationSettings'].includes(item.getId())
            ),
          ]),
    }),
  ],

  schema: {
    types: [
      {
        name: 'event',
        title: 'Event',
        type: 'document',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 } },
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
          {
            name: 'personType',
            title: 'Type',
            type: 'string',
            options: {
              list: [
                { title: 'Speaker', value: 'speaker' },
                { title: 'Ambassador', value: 'ambassador' }
              ],
              layout: 'radio'
            },
            initialValue: 'speaker'
          },
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
        name: 'registrationSettings',
        title: 'Registration & Pricing',
        type: 'document',
        fields: [
          {
            name: 'currency',
            title: 'Payment Currency',
            type: 'string',
            initialValue: 'usd',
            validation: (Rule) => Rule.required(),
            options: {
              list: [
                { title: 'US Dollar (USD)', value: 'usd' },
                { title: 'Euro (EUR)', value: 'eur' },
                { title: 'British Pound (GBP)', value: 'gbp' },
              ],
            },
          },
          {
            name: 'packages',
            title: 'Registration Packages',
            type: 'array',
            validation: (Rule) => Rule.required().min(1),
            of: [{
              type: 'object',
              name: 'registrationPackage',
              title: 'Registration Package',
              fields: [
                { name: 'id', title: 'Package ID', type: 'string', validation: (Rule) => Rule.required() },
                { name: 'name', title: 'Package Name', type: 'string', validation: (Rule) => Rule.required() },
                {
                  name: 'participationType',
                  title: 'Participation Type',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                  options: {
                    list: [
                      { title: 'Physical Event', value: 'physical' },
                      { title: 'Virtual Event', value: 'virtual' },
                    ],
                    layout: 'radio',
                  },
                },
                { name: 'price', title: 'Price', type: 'number', validation: (Rule) => Rule.required().positive() },
                { name: 'icon', title: 'Icon (Emoji)', type: 'string' },
                { name: 'popular', title: 'Mark as Popular', type: 'boolean', initialValue: false },
                { name: 'active', title: 'Available for Registration', type: 'boolean', initialValue: true },
                {
                  name: 'features',
                  title: 'Package Features',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
              ],
              preview: {
                select: { title: 'name', price: 'price', type: 'participationType', active: 'active' },
                prepare({ title, price, type, active }) {
                  return {
                    title: `${active === false ? '[Inactive] ' : ''}${title || 'Untitled package'}`,
                    subtitle: `${type || 'No type'} · $${Number(price || 0).toFixed(2)}`,
                  }
                },
              },
            }],
          },
          {
            name: 'coupons',
            title: 'Coupon Codes',
            type: 'array',
            of: [{
              type: 'object',
              name: 'registrationCoupon',
              title: 'Coupon',
              fields: [
                { name: 'code', title: 'Coupon Code', type: 'string', validation: (Rule) => Rule.required().uppercase() },
                {
                  name: 'discountType',
                  title: 'Discount Type',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                  options: {
                    list: [
                      { title: 'Percentage', value: 'percent' },
                      { title: 'Fixed Amount', value: 'amount' },
                    ],
                    layout: 'radio',
                  },
                },
                {
                  name: 'value',
                  title: 'Discount Value',
                  type: 'number',
                  description: 'Enter 20 for 20%, or 50 for a $50 discount.',
                  validation: (Rule) => Rule.required().positive(),
                },
                { name: 'description', title: 'Description', type: 'string' },
                { name: 'active', title: 'Coupon Active', type: 'boolean', initialValue: true },
              ],
              preview: {
                select: { title: 'code', value: 'value', type: 'discountType', active: 'active' },
                prepare({ title, value, type, active }) {
                  const discount = type === 'percent' ? `${value}%` : `$${value}`
                  return {
                    title: `${active === false ? '[Inactive] ' : ''}${title || 'Untitled coupon'}`,
                    subtitle: `${discount} discount`,
                  }
                },
              },
            }],
          },
        ],
        preview: {
          prepare() {
            return { title: 'Registration & Pricing' }
          },
        },
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
            description: 'The email address to send from (e.g., contact@prosummits.org)'
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
                        { title: 'Highlights', value: 'Highlights' },
                        { title: 'Speakers', value: 'Speakers' },
                        { title: 'Panel Discussions', value: 'Panels' },
                        { title: 'Global Venues', value: 'Locations' }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'post',
        title: 'Blog Post',
        type: 'document',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 } },
          { name: 'category', type: 'string', title: 'Category', initialValue: 'Science' },
          { name: 'date', type: 'string', title: 'Date', initialValue: 'Jun 01, 2026' },
          { name: 'color', type: 'string', title: 'Accent Color (Hex)', initialValue: '#00A79D' },
          { name: 'image', type: 'image', title: 'Cover Image', options: { hotspot: true } },
          { name: 'legacyImageUrl', type: 'string', title: 'Legacy Image URL (Fallback)' },
          { name: 'description', type: 'text', title: 'Short Description' },
          { name: 'content', type: 'text', title: 'Article Body (Plain Text / Simple)' },
          { name: 'introParagraphs', type: 'array', title: 'Introduction Paragraphs', of: [{ type: 'text' }] },
          { name: 'showGoldDivider', type: 'boolean', title: 'Show Gold Section Divider', initialValue: false },
          {
            name: 'sections',
            type: 'array',
            title: 'Content Sections',
            of: [{
              type: 'object',
              name: 'section',
              title: 'Section',
              fields: [
                { name: 'heading', type: 'string', title: 'Heading' },
                { name: 'paragraphs', type: 'array', title: 'Paragraphs', of: [{ type: 'text' }] },
                { name: 'showMitosisSimulator', type: 'boolean', title: 'Show Mitosis Simulator', initialValue: false },
                { name: 'showDecaySimulator', type: 'boolean', title: 'Show Decay Simulator', initialValue: false },
                {
                  name: 'floatingCard',
                  type: 'object',
                  title: 'Floating Card (Image)',
                  fields: [
                    { name: 'image', type: 'image', title: 'Card Image', options: { hotspot: true } },
                    { name: 'legacyImageUrl', type: 'string', title: 'Legacy Image URL' },
                    { name: 'caption', type: 'string', title: 'Caption' }
                  ]
                },
                {
                  name: 'infoBox',
                  type: 'object',
                  title: 'Context / Info Box',
                  fields: [
                    { name: 'badge', type: 'string', title: 'Badge Text' },
                    { name: 'title', type: 'string', title: 'Box Title' },
                    { name: 'text', type: 'text', title: 'Box Content' },
                    {
                      name: 'colorTheme',
                      type: 'string',
                      title: 'Color Theme',
                      options: {
                        list: [
                          { title: 'Gold Theme', value: 'gold' },
                          { title: 'Green Theme', value: 'green' }
                        ]
                      },
                      initialValue: 'gold'
                    }
                  ]
                },
                {
                  name: 'pullQuote',
                  type: 'object',
                  title: 'Pull Quote',
                  fields: [
                    { name: 'text', type: 'text', title: 'Quote Text' },
                    { name: 'citation', type: 'string', title: 'Citation' }
                  ]
                },
                {
                  name: 'bioethicsCard',
                  type: 'object',
                  title: 'Bioethics / Legacy Highlight Card',
                  fields: [
                    { name: 'title', type: 'string', title: 'Title' },
                    { name: 'quote', type: 'text', title: 'Quote' },
                    { name: 'meta', type: 'string', title: 'Meta Info' }
                  ]
                },
                {
                  name: 'timeline',
                  type: 'object',
                  title: 'Timeline Widget',
                  fields: [
                    { name: 'title', type: 'string', title: 'Timeline Title' },
                    {
                      name: 'milestones',
                      type: 'array',
                      title: 'Milestones',
                      of: [{
                        type: 'object',
                        fields: [
                          { name: 'year', type: 'string', title: 'Year / Period' },
                          { name: 'title', type: 'string', title: 'Milestone Title' },
                          { name: 'description', type: 'text', title: 'Description' },
                          {
                            name: 'colorTheme',
                            type: 'string',
                            title: 'Dot Color Theme',
                            options: {
                              list: [
                                { title: 'Gold (#c9a84c)', value: 'gold' },
                                { title: 'Green (#6bffb3)', value: 'green' }
                              ]
                            },
                            initialValue: 'gold'
                          }
                        ]
                      }]
                    }
                  ]
                },
                {
                  name: 'compareTable',
                  type: 'object',
                  title: 'Comparison Table',
                  fields: [
                    { name: 'headers', type: 'array', title: 'Table Headers', of: [{ type: 'string' }] },
                    {
                      name: 'rows',
                      type: 'array',
                      title: 'Table Rows',
                      of: [{
                        type: 'object',
                        fields: [
                          { name: 'label', type: 'string', title: 'Trait / Row Label' },
                          { name: 'col1', type: 'string', title: 'Column 1 Value' },
                          { name: 'col2', type: 'string', title: 'Column 2 Value' }
                        ]
                      }]
                    }
                  ]
                }
              ]
            }]
          }
        ]
      }
    ],
  },
})
