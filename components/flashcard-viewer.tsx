"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/vocabulary";

type Props = {
  cards: Flashcard[];
};

/**
 * @TODO need better shuffle
 */
function shuffle(items: Flashcard[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function FlashcardViewer({ cards }: Props) {
  const [deck, setDeck] = useState(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // TODO: add prev button...?
  const current = deck[index];
  if (!current) return null;

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
  }

  function onShuffle() {
    setDeck(shuffle(deck));
    setIndex(0);
    setFlipped(false);
  }

  return (
    <section className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className="flashcard group relative w-full overflow-hidden text-left"
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: "#f9e24c" }}
        />
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-6 px-8 py-12">
          <p
            className="text-5xl leading-tight sm:text-6xl"
            style={{
              fontFamily: "var(--font-hebrew)",
              color: "#373230",
            }}
            dir="rtl"
            lang="he"
          >
            {current.hebrew}
          </p>

          {flipped ? (
            <p
              className="border-t pt-6 text-center text-2xl font-medium sm:text-3xl"
              style={{ borderColor: "#d2cec6", color: "#373230" }}
            >
              {current.english}
            </p>
          ) : (
            <p className="text-sm text-[#716c66]">click to flip</p>
          )}
        </div>
      </button>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[#716c66]">
          {index + 1} / {deck.length}
        </p>
        <div className="flex gap-3">
          <button type="button" className="btn-secondary" onClick={onShuffle}>
            Shuffle
          </button>
          <button type="button" className="btn-primary" onClick={next}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
