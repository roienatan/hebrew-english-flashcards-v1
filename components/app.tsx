"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchCards } from "@/app/actions";
import type { Flashcard, LevelOption } from "@/lib/vocabulary";
import type { TierKey } from "@/lib/taxonomy";
import { TIERS } from "@/lib/taxonomy";
import { FlashcardViewer } from "@/components/flashcard-viewer";

type Props = {
  levels: LevelOption[];
};

export function App({ levels }: Props) {
  const [tier, setTier] = useState<TierKey | "">("");
  const [levelId, setLevelId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false); // old way
  // useTransition: cleaner way - UI is not blocked while updating the state + we get isPending (instead of useState)
  const [isPending, startTransition] = useTransition();

  const levelsForTier = tier
    ? levels.filter((level) => level.tier === tier)
    : [];
  const selectedLevel = levels.find((level) => level.id === levelId) ?? null;
  const needsType = (selectedLevel?.types.length ?? 0) > 0;
  const ready =
    Boolean(levelId) && (!needsType || Boolean(typeId)) && cards.length > 0;

  useEffect(() => {
    if (!levelId) return;

    const level = levels.find((item) => item.id === levelId);
    if (!level) return;

    // wait for pack if this level has them
    if (level.types.length > 0 && !typeId) {
      setCards([]);
      setError(null);
      return;
    }

    const resolvedTypeId = level.types.length > 0 ? typeId : null;

    startTransition(async () => {
      try {
        const next = await fetchCards(levelId, resolvedTypeId);
        setCards(next);
        setError(next.length === 0 ? "No cards for this one." : null);
      } catch {
        setCards([]);
        setError("Couldnt load cards, check DB");
      }
    });

    /**
     * before useTransition
     */
    // async function load() {
    //   setLoading(true);
    //   try {
    //     const next = await fetchCards(levelId, resolvedTypeId);
    //     setCards(next);
    //     setError(next.length === 0 ? "No cards for this one." : null);
    //   } catch {
    //     setCards([]);
    //     setError("Couldnt load cards, check your db connection.");
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // load();
  }, [levelId, typeId, levels]);

  return (
    <div className="flex flex-col gap-8">
      <form
        className="grid gap-4 sm:grid-cols-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold" style={{ color: "#716c66" }}>
            Tier
          </span>
          <select
            className="field"
            value={tier}
            onChange={(e) => {
              setTier(e.target.value as TierKey | "");
              setLevelId("");
              setTypeId("");
              setCards([]);
              setError(null);
            }}
          >
            <option value="">Select tier...</option>
            {TIERS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[var(--muted)]">
            Level
          </span>
          <select
            className="field"
            value={levelId}
            disabled={!tier}
            onChange={(event) => {
              setLevelId(event.target.value);
              setTypeId("");
              setCards([]);
              setError(null);
            }}
          >
            <option value="">
              {tier ? "Select level..." : "Pick a tier first"}
            </option>
            {levelsForTier.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold" style={{ color: "#716c66" }}>
            Type
          </span>
          <select
            className="field"
            value={typeId}
            disabled={!needsType}
            onChange={(e) => setTypeId(e.target.value)}
          >
            <option value="">
              {needsType ? "Select pack..." : "Not needed"}
            </option>
            {selectedLevel?.types.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name}
              </option>
            ))}
          </select>
        </label>
      </form>

      {selectedLevel && (
        <p className="flex items-center gap-2 text-sm" style={{ color: "#716c66" }}>
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: selectedLevel.color }}
          />
          Studying {selectedLevel.name}
          {needsType && typeId
            ? ` · ${selectedLevel.types.find((t) => t.id === typeId)?.name}`
            : ""}
        </p>
      )}

      {error && (
        <p
          className="rounded-md border bg-white px-4 py-3"
          style={{ borderColor: "#d2cec6", color: "#373230" }}
        >
          {error}
        </p>
      )}

      {isPending && !ready && (
        <div className="flex min-h-[240px] items-center justify-center text-[#716c66]">
          Loading...
        </div>
      )}

      {!isPending && !ready && !error && (
        <div className="flex min-h-[240px] items-center justify-center text-center text-[#716c66]">
          <p>Pick a tier + level{needsType ? " + pack" : ""} to start.</p>
        </div>
      )}

      {ready && (
        <FlashcardViewer key={`${levelId}-${typeId}`} cards={cards} />
      )}
    </div>
  );
}
