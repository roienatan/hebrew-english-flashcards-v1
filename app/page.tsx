import { App } from "@/components/app";
import { getLevels } from "@/lib/vocabulary";

export default async function Home() {
  let levels: Awaited<ReturnType<typeof getLevels>> = [];
  let dbError: string | null = null;

  try {
    levels = await getLevels();
  } catch {
    dbError =
      "DB ERROR - make sure .env is set and migations script ran";
  }

  return (
    <div className="min-h-full flex-1 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <h1
          className="text-4xl font-semibold tracking-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-display)", color: "#373230" }}
        >
          Hebrew vocab flashcards
        </h1>
        <p className="mt-3 max-w-xl text-lg" style={{ color: "#716c66" }}>
          Pick a tier and level (and a pack if there is one), then flip the
          cards. Hebrew on the front, english on the back.
        </p>

        <div className="mt-10">
          {dbError ? (
            <p className="font-semibold" style={{ color: "#373230" }}>
              {dbError}
            </p>
          ) : (
            <App levels={levels} />
          )}
        </div>
      </div>
    </div>
  );
}
