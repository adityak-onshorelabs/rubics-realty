/**
 * All copy and facts for rubicsrealty.com.
 *
 * Sources (pulled 11 Nov 2026):
 *   - rubicsrealty.com home, beaumonte.html, media.html (see research/raw/)
 *   - Rubics' own press release for BeauMonté Tower C (Nov 2026), syndicated by ANI, PTI, Business Standard, Mint.
 * Nothing here is invented. Anything conflicting or unconfirmed carries a TODO(client) note and is listed in README.md.
 * Copy rule: no em dashes, no "luxury redefined".
 */
import type {
  AmenityClub,
  ExplorerLevel,
  Figure,
  ImageAsset,
  Office,
  Person,
  Principle,
  Project,
  TravelGroup,
  UnitTable,
} from "./types";

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

export const images = {
  logo: { src: "/images/brand/rubics-logo.png", alt: "Rubics", width: 308, height: 64 },
  beaumonteLogo: { src: "/images/brand/beaumonte-logo-white.png", alt: "Rubics BeauMonté, Sion Circle", width: 378, height: 168 },
  heroPoster: { src: "/media/hero-three-sixty-west-poster.jpg", alt: "Aerial view of Three Sixty West in Worli at golden hour, with the Bandra–Worli Sea Link behind", width: 1600, height: 900 },
  heroPosterMobile: { src: "/media/hero-three-sixty-west-poster-mobile.jpg", alt: "Aerial view of Three Sixty West in Worli at golden hour", width: 600, height: 900 },
  beaumonteLobby: { src: "/images/beaumonte/lobby-render.jpg", alt: "BeauMonté arrival lobby: double-height ceiling, travertine floor, bronze screens", width: 1600, height: 982, impression: true },
  beaumonteTowerSky: { src: "/images/beaumonte/tower-render-sky.jpg", alt: "BeauMonté Tower C rising against a clear sky, balconies stacked to the crown", width: 1280, height: 768, impression: true },
  beaumonteTowerCorner: { src: "/images/beaumonte/tower-render-corner.jpg", alt: "Corner view of BeauMonté Tower C from below", width: 1280, height: 668, impression: true },
  beaumontePool: { src: "/images/beaumonte/pool-deck-dusk.jpg", alt: "Podium pool deck at dusk, cabanas lit along the water", width: 1312, height: 777, impression: true },
  beaumonteSketch: { src: "/images/beaumonte/tower-sketch.png", alt: "Pencil elevation sketch of the BeauMonté towers at Sion Circle", width: 442, height: 540 },
  beaumonteMap: { src: "/images/beaumonte/location-map.png", alt: "Map of Sion Circle showing BeauMonté, the Eastern Express Highway and nearby stations", width: 1315, height: 1878 },
  beaumonteQr: { src: "/images/beaumonte/maharera-qr.png", alt: "MahaRERA QR code for BeauMonté Tower C, registration P51900050715", width: 298, height: 296 },
  lalbaugSketch: { src: "/images/lalbaug/elevation-sketch.png", alt: "Pencil perspective sketch of the upcoming Rubics residence at Lalbaug", width: 1212, height: 704 },
} satisfies Record<string, ImageAsset>;

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */

export const company = {
  name: "Rubics Realty",
  group: "Rubics Group",
  motto: "Design-First. Built to Last.",
  url: "https://rubicsrealty.com",
  // TODO(client): two numbers and two emails appear on the old site. Sales line and email below are from the BeauMonté page.
  salesPhone: { display: "1800 209 6363", href: "tel:18002096363" },
  officePhone: { display: "+91 22 6666 5214", href: "tel:+912266665214" },
  salesEmail: "sales@rubics.co",
  generalEmail: "reach@rubics.co",
  // TODO(client): no WhatsApp Business number published. Set one here to show WhatsApp buttons site-wide.
  whatsapp: null as null | { display: string; href: string },
  social: [
    { label: "Instagram", href: "https://www.instagram.com/rubicsrealty" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/rubics-realty/" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61581511226864" },
    { label: "X", href: "https://x.com/realtyrubics" },
  ],
};

// TODO(client): home footer says Lodha Signet, Worli. Media footer and BeauMonté page say Business Square, Andheri West (registered office). Confirm both.
export const offices: Office[] = [
  {
    label: "Sales Experience Centre",
    lines: ["Near PVR Cinema, opp. Croma Showroom", "Sion Circle, Sion East", "Mumbai 400 022"],
    mapQuery: "Sion Circle, Sion East, Mumbai 400022",
  },
  {
    label: "Corporate office",
    lines: ["B-wing, 9th Floor, Lodha Signet", "Senapati Bapat Marg, Lower Parel", "Mumbai 400 013"],
    mapQuery: "Lodha Signet, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
  },
  {
    label: "Registered office",
    lines: ["403, Business Square", "Andheri West", "Mumbai 400 058"],
    mapQuery: "Business Square, Andheri West, Mumbai 400058",
  },
];

// TODO(client): figures as published on the old site and in Rubics' own press release. Confirm wording and attribution
// (Rubics Realty vs the founder's and Sahana Group's track record) before launch.
export const groupFigures: Figure[] = [
  { value: "20M+", label: "sq ft built and in development", note: "Portfolio under the founder's leadership" },
  { value: "10,000+", label: "families uplifted" },
  { value: "400+", label: "strong workforce" },
];

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

export const people: Person[] = [
  {
    slug: "suhan-shetty",
    name: "Suhan Shetty",
    role: "Founder & Managing Director",
    portrait: { src: "/images/people/suhan-shetty.jpg", alt: "Suhan Shetty, black-and-white portrait", width: 600, height: 790 },
    short: "Two decades in large-scale urban development, from Three Sixty West to BeauMonté.",
    bio: [
      "Suhan Shetty is a design-driven real estate leader shaping a new language of living in India. With over two decades in large-scale urban development, his work spans premium high-rise residences, hospitality, aviation and media.",
      "He has helmed marquee projects including Three Sixty West and BeauMonté in Mumbai, and is currently driving The Ritz-Carlton's development in the city. Under his leadership, Rubics oversees more than 20 million square feet of built and ongoing real estate.",
      "Educated at Leysin American School in Switzerland, his perspective was shaped by European cities where proportion, rhythm and context define urban design. He brings that sensibility to Indian real estate.",
      "Beyond luxury residences, he has advanced projects under Maharashtra's Slum Rehabilitation Act, championing design-conscious housing that puts dignity and livability first.",
    ],
  },
  {
    slug: "ravneet-gill",
    name: "Ravneet Gill",
    role: "Chief Executive Officer",
    portrait: { src: "/images/people/ravneet-gill.jpg", alt: "Ravneet Gill, black-and-white portrait", width: 600, height: 790 },
    short: "Two decades across Citigroup, EMAAR, Indiabulls Real Estate and TDI Group.",
    bio: [
      "With over two decades of leadership across India's real estate landscape, Ravneet Gill has shaped landmark developments that balance vision, design and performance.",
      "He began his career at Citigroup, followed by senior leadership roles at EMAAR, Indiabulls Real Estate and TDI Group, leading large-scale development, business expansion and strategic transformation.",
      "At Rubics Realty he leads P&L, growth strategy and development execution across asset classes.",
      "He holds an MMS from K.J. Somaiya Institute of Management and a B.Com from H.R. College, is a member of RICS, and sits on the Executive Committee of CREDAI.",
    ],
  },
  {
    slug: "sahana-shetty",
    name: "Sahana Shetty",
    role: "Director, Interiors & Spatial Strategy",
    portrait: { src: "/images/people/sahana-shetty.jpg", alt: "Sahana Shetty, black-and-white portrait", width: 600, height: 790 },
    short: "Interior and exhibition design trained in Leysin, Singapore and London.",
    bio: [
      "Sahana Shetty treats design as a dialogue between a space and the people who live in it, bringing European refinement and Asian dynamism to every Rubics interior.",
      "Her formative years in Leysin, Switzerland, gave her a deep regard for structure and nature. Her studies in Singapore (NAFA, LASALLE) and London (London Metropolitan University) refined her technical command of interior and exhibition design.",
      "At Rubics she shapes spaces that are not merely seen but felt.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Principles (condensed from the old site's Sustainability section)    */
/* ------------------------------------------------------------------ */

export const principles: Principle[] = [
  { code: "01", title: "Every design begins with context.", body: "Most developments begin with land and lofty promises. We begin with the place: its climate, culture and character. What stands here should belong here." },
  { code: "02", title: "Efficiency begins with the blueprint.", body: "Some retrofit solutions. We build them in. Every plan is drawn so airflow, light and energy move as easily as the people inside." },
  { code: "03", title: "Nothing is standard.", body: "Templates are for those who build by habit. From hinges to headspace, every detail is a decision." },
  { code: "04", title: "What we avoid matters too.", body: "Low-waste planning often begins with knowing what not to build." },
  { code: "05", title: "We think in life cycles.", body: "Timelines don't guide us. Lifespans do. Every choice is measured in longevity and use." },
  { code: "06", title: "Responsibility lies in the invisible.", body: "It isn't the marble you walk on. It's the membrane underneath. What isn't seen still decides how a building breathes and lasts." },
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: "beaumonte-tower-c",
    name: "BeauMonté Tower C",
    nameDisplay: "BeauMonté",
    locality: "Sion Circle",
    city: "Mumbai",
    status: "launched",
    statusLabel: "Now selling",
    rera: { number: "P51900050715", qr: images.beaumonteQr, url: "https://maharera.maharashtra.gov.in/" },
    accent: "beaumonte",
    oneLine: "Forty-one storeys above Sion Circle. Seven residences to a floor.",
    summary:
      "A 41-storey tower in a 6.8-acre gated community at Sion Circle, with 2.7 acres of recreational space, 50+ amenities and large 2 and 3 BHK residences with jodi options.",
    hero: images.beaumonteTowerSky,
    sketch: images.beaumonteSketch,
    facts: [
      { value: "41", label: "storeys" },
      { value: "7", label: "residences per floor" },
      { value: "2.7", label: "acres of recreation" },
      { value: "50+", label: "amenities" },
    ],
  },
  {
    slug: "lalbaug",
    name: "Lalbaug",
    nameDisplay: "Lalbaug",
    locality: "Lalbaug",
    city: "Mumbai",
    status: "rising-soon",
    statusLabel: "Rising soon",
    accent: "lalbaug",
    oneLine: "Rising soon in one of Mumbai's most iconic and auspicious neighbourhoods.",
    // TODO(client): Lalbaug RERA status. Copy is limited to what the old site published.
    summary:
      "Curated views, sculpted spaces and understated elegance, designed for those who think beyond square feet. A future landmark, built to compel.",
    hero: images.lalbaugSketch,
    sketch: images.lalbaugSketch,
    facts: [],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/* ------------------------------------------------------------------ */
/* BeauMonté Tower C                                                    */
/* ------------------------------------------------------------------ */

export const beaumonte = {
  intro: {
    kicker: "Rubics Realty · Sion Circle, Mumbai · Tower C",
    title: "Where life rises above all.",
    lede: "A home you don't walk into. One you arrive at.",
    body: [
      "Some homes are made. A few are composed.",
      "BeauMonté Tower C rises forty-one floors above Sion Circle, one of Mumbai's oldest, most connected neighbourhoods. Seven residences to a floor. Balconies that look past a skyline you already know, toward one you've only driven toward.",
      "It is, simply, the view from a life that has stopped rushing.",
    ],
    quote: "This is not an address you find. This is an address you arrive at.",
  },
  specs: [
    { label: "Storeys", value: "41" },
    { label: "Residences per floor", value: "7" },
    { label: "E-Deck", value: "Level 6" },
    { label: "Podium parking", value: "5 levels" },
    { label: "Basements", value: "1 + ground" },
    { label: "Elevators", value: "5 high-speed" },
    { label: "Recreational space", value: "2.7 acres" },
    { label: "Gated community", value: "6.8 acres" },
    { label: "Configurations", value: "2 & 3 BHK, jodi" },
  ],
  partners: [
    { role: "Architecture", name: "P&T Consultants Pte. Ltd. & Sanjay Puri Architects" },
    { role: "Contracting", name: "Argentec Ltd" },
    { role: "Landscape", name: "Site Concept" },
  ],
  architecture: {
    title: "A tower that earns its height.",
    body: [
      "Tall is easy. Considered is rare.",
      "Tower C is designed by P&T Consultants and Sanjay Puri Architects with a facade built for a simple long-term question: will it still look right in thirty years? The answer is in every line of it.",
      "The podium, conceived by landscape partner Site Concept, turns 2.7 acres of open recreational space into a living, breathing resort.",
    ],
  },
  views: [
    { dir: "West", body: "The Arabian Sea working through its palette: the gold of six, the silver of noon, the violet of dusk. The Bandra–Worli Sea Link tracing its long, quiet arc." },
    { dir: "North", body: "The city, unfolded. The monorail threading between buildings like a slow line of handwriting. Rooftops and towers at a distance that finally lets you notice them." },
    { dir: "Above", body: "At forty-one floors, weather arrives at your window before it reaches the street. On the best days, clouds don't pass by. They pass through." },
  ],
  residences: {
    title: "Seven to a floor. No exceptions.",
    body: "A tower this tall could have been planned for density. This one wasn't. Seven residences per floor is the ceiling, because privacy, once given up, is nearly impossible to rebuild.",
    note: "RERA carpet area as per Maharashtra RERA, in sq ft. All areas are approximate and subject to variation.",
  },
  // TODO(client): copy says "4 BHK jodi", the old table says "5 BHK jodi residences". Labelled "Jodi" until confirmed.
  // TODO(client): confirm whether saleable area should be shown at all under current MahaRERA advertising guidance.
  unitTables: [
    {
      id: "typical",
      title: "Typical floor",
      floors: "8th floor and above",
      outdoorLabel: "Balcony",
      rows: [
        { unit: "01", config: "3 BHK", carpet: 1408.89, outdoor: 102.37, saleable: 1511.26 },
        { unit: "02", config: "2 BHK", carpet: 887.7, outdoor: 91.39, saleable: 979.1 },
        { unit: "03", config: "3 BHK", carpet: 1412.34, outdoor: 99.78, saleable: 1512.12 },
        { unit: "04", config: "3 BHK", carpet: 1103.63, outdoor: 92.25, saleable: 1195.88 },
        { unit: "05", config: "2 BHK", carpet: 799.22, outdoor: 83.21, saleable: 882.43 },
        { unit: "06", config: "2 BHK", carpet: 799.22, outdoor: 83.21, saleable: 882.43 },
        { unit: "07", config: "3 BHK", carpet: 1103.63, outdoor: 92.25, saleable: 1195.88 },
      ],
    },
    {
      id: "jodi",
      title: "Jodi residences",
      floors: "Combined units on typical floors",
      outdoorLabel: "Balcony",
      rows: [
        { unit: "01", config: "Jodi", carpet: 2309.09, outdoor: 193.75, saleable: 2502.84 },
        { unit: "03", config: "Jodi", carpet: 1913.19, outdoor: 175.67, saleable: 2088.86 },
        { unit: "04", config: "Jodi", carpet: 1913.19, outdoor: 175.67, saleable: 2088.86 },
      ],
    },
    {
      id: "upper",
      title: "Stepping floors with terrace",
      floors: "39th, 40th & 41st",
      outdoorLabel: "Balcony + terrace",
      rows: [
        { unit: "01", config: "4 BHK", carpet: 1761.63, outdoor: 232.29, saleable: 2500.36 },
        { unit: "02", config: "3 BHK", carpet: 1412.34, outdoor: 99.78, saleable: 1512.12 },
        { unit: "03", config: "4 BHK", carpet: 1677.14, outdoor: 404.94, saleable: 2082.08 },
        { unit: "04", config: "4 BHK", carpet: 1677.14, outdoor: 404.94, saleable: 2082.08 },
      ],
    },
  ] satisfies UnitTable[],
  /**
   * Section explorer bands. From the old site's Tower Specifications and unit tables only.
   * Level 7 is not described anywhere published, so it is shown as "details on request".
   */
  levels: [
    { from: 39, to: 41, code: "L39–41", name: "Stepping floors with terrace", kind: "terrace", summary: "The crown. Four residences per floor with terraces, the largest outdoor areas in the tower.", points: ["4 BHK and 3 BHK residences", "Terraces up to 404.94 sq ft with balcony", "Highest residences in the tower"], unitTableId: "upper" },
    { from: 8, to: 38, code: "L08–38", name: "Typical residential floors", kind: "residential", summary: "Seven residences to a floor: three 3 BHK layouts, three 2 BHK, and one large 3 BHK corner. Jodi combinations available.", points: ["7 residences per floor", "2 BHK from 799.22 sq ft RERA carpet", "3 BHK up to 1,412.34 sq ft RERA carpet", "Jodi residences up to 2,309.09 sq ft"], unitTableId: "typical" },
    { from: 7, to: 7, code: "L07", name: "Level 7", kind: "unpublished", summary: "Details for this level are shared by the sales team on request.", points: [] },
    { from: 6, to: 6, code: "L06", name: "E-Deck", kind: "amenity", summary: "An elevated amenity level above the podium, part of the 2.7 acres of recreational space.", points: ["Elevated amenity experience", "Tower-exclusive guest rooms and fitness centre", "Part of 50+ amenities across podium and tower"] },
    { from: 1, to: 5, code: "P1–P5", name: "Podium parking", kind: "service", summary: "Five levels of podium parking. Cars stay out of the landscape.", points: ["5 podium parking levels", "5 high-speed elevators serve the tower"] },
    { from: 0, to: 0, code: "G", name: "Ground", kind: "service", summary: "Arrival at the gated community, within a 6.8-acre layout at Sion Circle.", points: ["Gated community", "Largest land parcel in the vicinity"] },
    { from: -1, to: -1, code: "B1", name: "Basement", kind: "service", summary: "One basement level.", points: [] },
  ] satisfies ExplorerLevel[],
  amenities: {
    title: "Fifty+ reasons to stay in.",
    body: "The count matters less than the instinct behind it. Every amenity was added to answer one question: what does a Saturday look like? And a slow Tuesday evening? The answers are spread across the podium, the clubhouse and the tower.",
    note: "Tower-exclusive amenities: guest rooms and fitness centre.",
    clubs: [
      { name: "The Club", items: ["High-tech gymnasium", "Multipurpose court: badminton, basketball, indoor football, padel and pickleball, squash", "Indoor games", "Games studio", "E-gaming area", "Business centre", "Gentleman's lounge", "Hubbing area", "Health café", "Open terrace theatre", "Changing rooms", "Service counter"] },
      { name: "The Aquatique", items: ["50-metre lap pool", "Kids' pool", "Pool deck", "Cabana seating", "Multipurpose lawn", "Outdoor shower"] },
      { name: "Social House", items: ["Dining pavilion", "Buffet pavilion", "Family pavilion", "Party lawn", "Sit-out zone", "Senior citizens' corner", "Individual tower guest rooms", "Pilates room", "Meditation room", "Aerobics room"] },
      { name: "The Healing House", items: ["Spa cove", "Steam and sauna", "Massage room", "Recovery room", "Salon", "Reflexology path", "Terrace yoga and meditation area", "Dog wellness park"] },
      { name: "The Grove", items: ["1 km jogging track", "Activity grove", "Amphitheatre", "Chill-out zone", "Soothing water stream"] },
      { name: "The Junior Club", items: ["Kids' play zone", "Toddlers' play area", "Indoor kids' play area", "Pickleball court"] },
      { name: "The Service Court", items: ["Serviced kitchen", "Chef on call", "Housekeeping", "Laundry room"] },
      { name: "The Sanctuary", items: ["Jain temple"] },
    ] satisfies AmenityClub[],
  },
  location: {
    title: "Sion Circle. Where the city finds its heart.",
    body: [
      "Some neighbourhoods sit on a map. Others hold the map together.",
      "Sion is the geographic pivot where Mumbai bends from south to north. Expressways converge here. South Bombay opens one way; BKC, the airport and Atal Setu open the others.",
      "With the BKC–Chunabhatti link road and a growing metro grid redrawing the daily commute, Sion isn't simply central any more. It is the centre.",
    ],
    note: "Travel times are indicative and subject to traffic conditions.",
    key: [
      { place: "Eastern Express Highway", time: "3" },
      { place: "Sion railway station", time: "5" },
      { place: "Wadala monorail station", time: "5" },
      { place: "Atal Setu", time: "15" },
      { place: "BKC", time: "16" },
      { place: "CSIA International Airport", time: "20" },
    ],
    groups: [
      { title: "Road & rail", items: [
        { place: "King's Circle railway station", time: "9" },
        { place: "Parel", time: "14" },
        { place: "Lower Parel", time: "14" },
        { place: "Fort", time: "24" },
      ] },
      { title: "Schools & colleges", items: [
        { place: "Trinity International School", time: "5" },
        { place: "SIES College of Arts & Science", time: "5" },
        { place: "C.B.M. High School", time: "6" },
        { place: "Don Bosco High School", time: "7" },
        { place: "Khalsa College", time: "8" },
        { place: "VJTI", time: "9" },
        { place: "Orchids International School", time: "10" },
        { place: "Welingkar Institute", time: "11" },
        { place: "Seven Rivers International School", time: "14" },
        { place: "JBCN International School", time: "17" },
        { place: "Billabong High International School", time: "18" },
      ] },
      { title: "Hospitals", items: [
        { place: "Atharva Hospital", time: "4" },
        { place: "Sion Polyclinic Hospital", time: "7" },
        { place: "Lokmanya Tilak Municipal General Hospital", time: "7" },
        { place: "Gondhalekar Children's Hospital", time: "10" },
        { place: "K. J. Somaiya Hospital & Research Centre", time: "10" },
        { place: "Surana Sethia Hospital", time: "12" },
        { place: "P. D. Hinduja National Hospital", time: "15" },
      ] },
      { title: "Shopping & leisure", items: [
        { place: "Carnival Cinemas IMAX", time: "8" },
        { place: "DMart Ready", time: "9" },
        { place: "Wadala Gymkhana", time: "9" },
        { place: "Nakshatra Mall", time: "13" },
        { place: "Home Town", time: "13" },
        { place: "Paradise E Square", time: "15" },
        { place: "Mahim Beach", time: "19" },
        { place: "Kamala Mills", time: "20" },
        { place: "High Street Phoenix", time: "22" },
      ] },
      { title: "Places of worship", items: [
        { place: "Jain Temple", time: "1" },
        { place: "Hari Mandir", time: "4" },
        { place: "Shree Krishna Temple", time: "10" },
        { place: "Siddhivinayak Temple", time: "15" },
      ] },
    ] satisfies TravelGroup[],
  },
  developer: {
    title: "Design-first. Built to last.",
    body: [
      "We don't build to the moment. We build to outlast it.",
      "Every Rubics residence starts with the same belief: architecture should answer to the life being lived inside it, not the other way around. Light has a job. So does air. So does the space between two rooms.",
    ],
    // TODO(client): BeauMonté is developed with Sahana Group (old site, "An address by" Rubics + Sahana; listing portals name Sheth Creators). Confirm the exact credit line.
    credit: "An address by Rubics Realty and Sahana Group.",
  },
  promise: ["On time, every time", "Highest quality standards", "Compliance"],
  disclaimer:
    "The plans, specifications, elevations, conceptual designs, visuals, images, dimensions, photographs, furniture, fixtures, amenities and facilities depicted are for representation only and subject to approvals from competent authorities. This does not constitute an offer or contract of any nature.",
};

/* ------------------------------------------------------------------ */
/* Page copy                                                           */
/* ------------------------------------------------------------------ */

export const home = {
  hero: {
    title: ["Design-first.", "Built to last."],
    lede: "Rubics Realty builds residences in Mumbai's established neighbourhoods, shaped by proportion, clarity and architectural precision.",
    lineage: "From the makers of Three Sixty West",
    videoCaption: "Three Sixty West, Worli",
  },
  directory: {
    title: "Addresses",
    body: "Two Mumbai neighbourhoods with long memories. One tower now selling, one rising soon.",
  },
  build: {
    title: "We build by thought, not by habit.",
    body: "Each Rubics development begins with one belief: architecture should reflect attention to the smallest detail, an eye for scale, and design that stays ahead of its time.",
  },
  lineage: {
    title: "Led by legacy.",
    body: "Rubics brings together designers, planners, engineers and builders united by one idea: timelessness is built, not imagined.",
    quote: "We don't follow global benchmarks. We create the next ones.",
    quoteBy: "Suhan Shetty, Founder & Managing Director",
  },
};

export const about = {
  title: "Homes should reflect the life within them.",
  lede: "Not trends or tinted facades, but clarity, rhythm and quiet intent.",
  body: [
    "Rubics Realty is the residential arm of Rubics Group, founded by Suhan Shetty. It draws on two decades of development experience and a design-first sensibility shaped by global cities.",
    "From blueprint to build, every decision is guided by one purpose: to make living feel more considered.",
  ],
  vision: "To foster a new era of development where architecture is thoughtful, context is respected and living is redefined, with homes that are intelligent, flexible and clear in identity.",
  mission: "Thoughtful design leads every decision. Ecological responsibility is a mindset, not a checkbox. We build with intent and deliver with integrity. Every line drawn, every material chosen, every square foot planned serves a purpose.",
};

export const nav = [
  { label: "Projects", href: "/projects" },
  { label: "BeauMonté", href: "/projects/beaumonte-tower-c" },
  { label: "About", href: "/about" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
];

export const enquiryCopy = {
  consent:
    "I agree that Rubics Realty may use these details to respond to my enquiry about its projects by phone, email or WhatsApp. I can withdraw consent at any time by writing to sales@rubics.co.",
  success: "Thank you. Our sales team will call you to confirm.",
  privacyNote: "We use your details only to respond to this enquiry. See our privacy policy.",
};
