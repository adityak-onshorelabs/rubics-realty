export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Render or CGI: shows an "Artist's impression" tag. */
  impression?: boolean;
};

export type Cta = { label: string; href: string };

export type Person = {
  slug: string;
  name: string;
  role: string;
  portrait: ImageAsset;
  short: string;
  bio: string[];
};

export type Figure = { value: string; label: string; note?: string };

export type Principle = { code: string; title: string; body: string };

export type UnitRow = {
  unit: string;
  config: string;
  carpet: number;
  outdoor: number;
  saleable: number;
};

export type UnitTable = {
  id: string;
  title: string;
  floors: string;
  outdoorLabel: string;
  rows: UnitRow[];
};

export type ExplorerLevel = {
  /** Lowest and highest level in the band, as numbers. Basement is -1, ground 0. */
  from: number;
  to: number;
  code: string;
  name: string;
  kind: "service" | "amenity" | "residential" | "terrace" | "unpublished";
  summary: string;
  points: string[];
  unitTableId?: string;
};

export type AmenityClub = { name: string; items: string[] };

export type TravelGroup = { title: string; items: { place: string; time: string }[] };

export type Project = {
  slug: string;
  name: string;
  nameDisplay: string;
  locality: string;
  city: string;
  status: "launched" | "rising-soon" | "completed";
  statusLabel: string;
  rera?: { number: string; qr: ImageAsset; url: string };
  accent: string;
  oneLine: string;
  summary: string;
  hero: ImageAsset;
  sketch?: ImageAsset;
  facts: Figure[];
};

export type PressStory = {
  slug: string;
  title: string;
  category: "real-estate" | "group";
  date: string;
  /** Cover image from the old media page. */
  image: ImageAsset;
  outlets: string[];
  summary: string;
  body: string[];
};

export type Office = {
  label: string;
  lines: string[];
  mapQuery: string;
};
