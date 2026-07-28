export type TierKey = "FOUNDATION" | "FLOW" | "FREEDOM";

export type LevelDefinition = {
  name: string;
  slug: string;
  tier: TierKey;
  color: string;
  sortOrder: number;
  // 0 = no type dropdown
  packCount: number;
};

export const TIERS: { key: TierKey; label: string }[] = [
  { key: "FOUNDATION", label: "Foundation" },
  { key: "FLOW", label: "Flow" },
  { key: "FREEDOM", label: "Freedom" },
];

export const LEVELS: LevelDefinition[] = [
  { name: "Red", slug: "red", tier: "FOUNDATION", color: "#E53935", sortOrder: 1, packCount: 0 },
  { name: "Orange", slug: "orange", tier: "FOUNDATION", color: "#FB8C00", sortOrder: 2, packCount: 0 },
  { name: "Pink", slug: "pink", tier: "FOUNDATION", color: "#EC407A", sortOrder: 3, packCount: 0 },
  { name: "Yellow", slug: "yellow", tier: "FOUNDATION", color: "#F9E24C", sortOrder: 4, packCount: 0 },
  { name: "Light Blue", slug: "light-blue", tier: "FLOW", color: "#4FC3F7", sortOrder: 5, packCount: 0 },
  { name: "Blue", slug: "blue", tier: "FLOW", color: "#1E88E5", sortOrder: 6, packCount: 0 },
  { name: "Lime", slug: "lime", tier: "FLOW", color: "#C0CA33", sortOrder: 7, packCount: 0 },
  { name: "Green", slug: "green", tier: "FLOW", color: "#43A047", sortOrder: 8, packCount: 0 },
  { name: "Dark Green", slug: "dark-green", tier: "FREEDOM", color: "#2E7D32", sortOrder: 9, packCount: 4 },
  { name: "Turquoise", slug: "turquoise", tier: "FREEDOM", color: "#26A69A", sortOrder: 10, packCount: 4 },
  { name: "Indigo", slug: "indigo", tier: "FREEDOM", color: "#5C6BC0", sortOrder: 11, packCount: 6 },
  { name: "Purple", slug: "purple", tier: "FREEDOM", color: "#8E24AA", sortOrder: 12, packCount: 0 },
];

export function packSlug(index: number) {
  return `pack-${index}`;
}
