import { prisma } from "@/lib/prisma";
import type { TierKey } from "@/lib/taxonomy";

export type Flashcard = {
  id: string;
  hebrew: string;
  english: string;
};

export type LevelOption = {
  id: string;
  name: string;
  slug: string;
  color: string;
  sortOrder: number;
  tier: TierKey;
  types: { id: string; name: string; slug: string; sortOrder: number }[];
};

export async function getLevels(): Promise<LevelOption[]> {
  const levels = await prisma.level.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      types: { orderBy: { sortOrder: "asc" } },
    },
  });

  return levels.map((level) => ({
    id: level.id,
    name: level.name,
    slug: level.slug,
    color: level.color,
    sortOrder: level.sortOrder,
    tier: level.tier as TierKey,
    types: level.types.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      sortOrder: t.sortOrder,
    })),
  }));
}

export async function getCards(levelId: string, typeId?: string | null) {
  return prisma.card.findMany({
    where: {
      levelId,
      ...(typeId ? { typeId } : { typeId: null }),
    },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      hebrew: true,
      english: true,
    },
  });
}
