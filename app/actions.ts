"use server";

import { getCards, getLevels } from "@/lib/vocabulary";

export async function fetchLevels() {
  return getLevels();
}

export async function fetchCards(levelId: string, typeId: string | null) {
  return getCards(levelId, typeId);
}
