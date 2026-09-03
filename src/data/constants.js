/* ─── LOGO COLOURS ─────────────────────────────────────────────
   Purple  #7B2FBE   Orange  #F47B20   Yellow  #F9C515
   Green   #6DBE45   Teal    #00A79D   Red     #E01F5C
   Blue    #2D73BE   Magenta #C4187A
──────────────────────────────────────────────────────────────── */

export const LOGO_COLORS = {
  purple: 0x7B2FBE,
  orange: 0xF47B20,
  yellow: 0xF9C515,
  green: 0x6DBE45,
  teal: 0x00A79D,
  red: 0xE01F5C,
  blue: 0x2D73BE,
  magenta: 0xC4187A,
};

export const COLOR_ARR = Object.values(LOGO_COLORS);

export const EVENTS = [
  {
    badge: "Virtual",
    bdColor: "#7B2FBE",
    dateColor: "#B388FF",
    type: "💻 Online",
    date: "Nov 6–7, 2025",
    title: "7th Resilient Women Wellness Congress",
    loc: "Tokyo, Japan (Virtual)",
    chips: ["Women's Wellness", "Resilience", "Empowerment"],
    img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d8?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Open Now",
    bdColor: "#E01F5C",
    dateColor: "#FF8AAE",
    type: "🌍 Hybrid",
    date: "Nov 28–29, 2025",
    title: "8th Global Unstoppable Women's Empowerment Summit",
    loc: "Dubai, UAE",
    chips: ["Women's Leadership", "Empowerment", "Inclusion"],
    img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Upcoming",
    bdColor: "#00A79D",
    dateColor: "#4ECDC4",
    type: "🌍 Hybrid",
    date: "Mar 2–8, 2026",
    title: "Women's Rights & Leadership World Congress",
    loc: "Paris, France",
    chips: ["Women's Rights", "Gender Equality", "Policy"],
    img: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Upcoming",
    bdColor: "#F47B20",
    dateColor: "#F9A84A",
    type: "🌍 Hybrid",
    date: "Mar 2–8, 2026",
    title: "Global Mental Health & Wellness Forum",
    loc: "Paris, France",
    chips: ["Mental Health", "Wellness", "Psychiatry"],
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Upcoming",
    bdColor: "#6DBE45",
    dateColor: "#A0E06A",
    type: "🌍 Hybrid",
    date: "Mar 2–8, 2026",
    title: "Cancer Research Breakthroughs Summit",
    loc: "Paris, France",
    chips: ["Oncology", "Cancer Research", "MedTech"],
    img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Upcoming",
    bdColor: "#2D73BE",
    dateColor: "#70AAEE",
    type: "🌍 Hybrid",
    date: "Mar 2–8, 2026",
    title: "AI & Future Technologies Congress",
    loc: "Paris, France",
    chips: ["Artificial Intelligence", "Technology", "Innovation"],
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Early Bird",
    bdColor: "#C4187A",
    dateColor: "#F06EBB",
    type: "🌍 Hybrid",
    date: "Jul 20–22, 2026",
    title: "Entrepreneurship & Innovation Summit",
    loc: "Miami, FL, USA",
    chips: ["Entrepreneurship", "Startups", "Business"],
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Early Bird",
    bdColor: "#F9C515",
    dateColor: "#FFE066",
    type: "🌍 Hybrid",
    date: "Jul 20–22, 2026",
    title: "Autism & Behavioural Sciences World Forum",
    loc: "New York, USA",
    chips: ["Autism", "Behavioural Sciences", "Inclusion"],
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    price: "Free"
  },

  {
    badge: "Early Bird",
    bdColor: "#7B2FBE",
    dateColor: "#B388FF",
    type: "🌍 Hybrid",
    date: "Oct 2–8, 2026",
    title: "Women in Science & Technology Congress",
    loc: "Toronto, Canada",
    chips: ["Women in STEM", "Science", "Technology"],
    img: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=600&q=80",
    price: "Free"
  },
];

export const AMB_COLORS = ["#7B2FBE", "#E01F5C", "#F47B20", "#6DBE45", "#00A79D", "#2D73BE", "#C4187A", "#F9C515"];

import julia from '../assets/Julia Evans.jpeg';
import ignacio from '../assets/Dr. Ignacio Bonasa Alzuria.jpeg';
import giselle from '../assets/Giselle Arellano - Geronimo.jpeg';
import lydia from '../assets/Lydia gray.jpeg';
import debra from '../assets/Debra Diana.jpeg';
import amanda from '../assets/Dr. Amanda Fernandez.jpeg';
import melody from '../assets/Melody Wilder.jpeg';
import helen from '../assets/Helen Perry.jpeg';

export const SPEAKERS = [
  { init: "JE", name: "Julia Evans", role: "Guest Speaker", loc: "New York, USA", img: julia },
  { init: "IB", name: "Dr. Ignacio Bonasa Alzuria", role: "Guest Speaker", loc: "Dubai, UAE", img: ignacio },
  { init: "GA", name: "Giselle Arellano - Geronimo", role: "Guest Speaker", loc: "Paris, France", img: giselle },
  { init: "LG", name: "Lydia gray", role: "Guest Speaker", loc: "Tokyo, Japan", img: lydia },
  { init: "DD", name: "Debra Diana", role: "Guest Speaker", loc: "Toronto, Canada", img: debra },
  { init: "AF", name: "Dr. Amanda Fernandez", role: "Guest Speaker", loc: "Miami, FL, USA", img: amanda },
  { init: "MW", name: "Melody Wilder", role: "Guest Speaker", loc: "Los Angeles, USA", img: melody },
  { init: "HP", name: "Helen Perry", role: "Guest Speaker", loc: "London, UK", img: helen },
];

export const TEST_COLORS = [
  { star: "#F9C515", card: "rgba(249,197,21,.08)", border: "rgba(249,197,21,.2)" },
  { star: "#00A79D", card: "rgba(0,167,157,.08)", border: "rgba(0,167,157,.2)" },
  { star: "#E01F5C", card: "rgba(224,31,92,.08)", border: "rgba(224,31,92,.2)" },
];

export const TESTIMONIALS = [
  { txt: "ProSummits delivered on every promise. Achieved cost control and saved a lot of resources for the company. The hybrid format meant our whole team could attend without expensive travel — truly world-class event management.", name: "Michael Thornton", role: "CEO, GlobalTech Solutions" },
  { txt: "An inspiring platform that brought together women leaders and advocates from across the globe. The sessions were deeply insightful and the connections made were invaluable to both our mission and our growth.", name: "Dr. Amara Diallo", role: "Director, Women's Empowerment Africa" },
  { txt: "Achieved cost control and saved a lot of resources. The virtual participation option is flawlessly integrated — you genuinely feel part of every conversation whether in the room or joining from across the world.", name: "Wei-Lin Chang", role: "Chief Innovation Officer, SingTech" },
];

export const GALLERY_IMGS = [
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", lbl: "Global Leadership Summit — Dubai", gradient: "linear-gradient(135deg,rgba(123,47,190,.7),rgba(224,31,92,.7))" },
  { src: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&q=80", lbl: "Women's Empowerment Panel", gradient: "linear-gradient(135deg,rgba(244,123,32,.7),rgba(249,197,21,.7))" },
  { src: "https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=400&q=80", lbl: "Keynote Session", gradient: "linear-gradient(135deg,rgba(109,190,69,.7),rgba(0,167,157,.7))" },
  { src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", lbl: "Networking Gala — Paris", gradient: "linear-gradient(135deg,rgba(0,167,157,.7),rgba(45,115,190,.7))" },
  { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80", lbl: "Workshop: AI & Future Tech", gradient: "linear-gradient(135deg,rgba(196,24,122,.7),rgba(123,47,190,.7))" },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80", lbl: "Cancer Research Roundtable", gradient: "linear-gradient(135deg,rgba(224,31,92,.7),rgba(244,123,32,.7))" },
];

export const SPONSORS = [
  { name: "Global Partner", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-6.png" },
  { name: "Live Event", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-5.png" },
  { name: "Corporate Sponsor", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-4.png" },
  { name: "Diamond Sponsor", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-8.png" },
  { name: "Platinum Partner", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-1.png" },
  { name: "Gold Sponsor", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-2.png" },
  { name: "Silver Partner", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-3.png" },
  { name: "Official Partner", src: "https://prosummits.org/wp-content/uploads/2018/12/sponsor-7.png" },
];
export const SP_COLORS = ["#7B2FBE", "#F47B20", "#F9C515", "#6DBE45", "#00A79D", "#E01F5C", "#2D73BE", "#C4187A", "#7B2FBE", "#F47B20", "#6DBE45", "#00A79D"];

export const ORG_COLORS = ["#7B2FBE", "#E01F5C", "#F47B20", "#6DBE45", "#00A79D", "#C4187A"];
export const ORGANIZERS = [
  { ico: "🌐", name: "ProSummits Global HQ", desc: "Based in BLVD Heights, Dubai Opera District — our HQ coordinates all global hybrid events across 6+ conference themes." },
  { ico: "🤝", name: "Women's Leadership Network", desc: "A founding featured partner dedicated to amplifying women's voices and advancing gender equality at every level." },
  { ico: "🔬", name: "Global Health Research Consortium", desc: "Medical and research partners providing scientific governance for our Cancer Research and Mental Health summits." },
  { ico: "🤖", name: "Future Technologies Alliance", desc: "Technology partners and AI research bodies who co-curate our AI & Future Technologies congress tracks." },
  { ico: "💡", name: "Entrepreneurship Foundation", desc: "Partner organisation supporting emerging founders, early-stage speakers, and entrepreneurs at our business summits." },
  { ico: "🧩", name: "Autism Sciences Network", desc: "Specialist scientific partner for peer review, speaker selection, and community outreach for our Autism forums." },
];

export const MARQUEE_ITEMS = [
  { t: "Women's Rights", c: "#E01F5C" },
  { t: "Mental Health", c: "#7B2FBE" },
  { t: "Cancer Research", c: "#F47B20" },
  { t: "Artificial Intelligence", c: "#2D73BE" },
  { t: "Entrepreneurship", c: "#F9C515" },
  { t: "Autism Sciences", c: "#6DBE45" },
  { t: "Resilience & Wellness", c: "#00A79D" },
  { t: "Women's Leadership", c: "#C4187A" },
  { t: "Global Impact", c: "#F47B20" },
  { t: "Hybrid Conferences", c: "#7B2FBE" },
];

export const HERO_STATS = [
  { n: "24+", l: "Upcoming Events", c: "#F9C515" },
  { n: "200+", l: "Speakers", c: "#6DBE45" },
  { n: "20+", l: "Conference Themes", c: "#00A79D" },
  { n: "Global", l: "Hybrid Format", c: "#E01F5C" },
];

export const NAV_LINKS = [
  ["Home", "/"],
  ["Events", "/events"],
  ["Speakers", "/speakers"],
  ["Blog", "/blog"],
  ["Magazines", "/magazines"],
  ["Gallery", "/gallery"],
  ["Sponsors", "/sponsors"],
  ["About Us", "/about"],
  ["Contact Us", "/contact"],
];
