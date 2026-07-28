import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { LEVELS, packSlug } from "../lib/taxonomy";
import { seedLeaves } from "../seed/data";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL missing - add it to .env first");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  console.log("clearing old data...");
  await prisma.card.deleteMany();
  await prisma.type.deleteMany();
  await prisma.level.deleteMany();

  console.log("seeding...");
  for (const level of LEVELS) {
    const created = await prisma.level.create({
      data: {
        name: level.name,
        slug: level.slug,
        tier: level.tier,
        color: level.color,
        sortOrder: level.sortOrder,
        types:
          level.packCount > 0
            ? {
                create: Array.from({ length: level.packCount }, (_, i) => ({
                  name: `Pack ${i + 1}`,
                  slug: packSlug(i + 1),
                  sortOrder: i + 1,
                })),
              }
            : undefined,
      },
      include: { types: true },
    });

    const leaves = seedLeaves.filter((leaf) => leaf.level === level.name);
    for (const leaf of leaves) {
      const type =
        leaf.type === null
          ? null
          : created.types.find((t) => t.name === leaf.type) ?? null;

      if (leaf.type !== null && !type) {
        throw new Error(`missing type "${leaf.type}" on ${level.name}`);
      }

      await prisma.card.createMany({
        data: leaf.pairs.map((pair, index) => ({
          hebrew: pair.hebrew,
          english: pair.english,
          sortOrder: index + 1,
          levelId: created.id,
          typeId: type?.id ?? null,
        })),
      });
    }

    const n = leaves.reduce((sum, l) => sum + l.pairs.length, 0);
    console.log(`  ${level.name}: ${n} cards`);
  }

  const total = await prisma.card.count();
  console.log(`done, ${total} cards total`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
