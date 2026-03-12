import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { anyApi } from 'convex/server';
import { useMutation, useQuery } from 'convex/react';

type Deck = {
  _id: string;
  name: string;
};

type Card = {
  _id: string;
  front: string;
  back: string;
};

type DueCard = Card & {
  dueAt: number;
  phase: 'new' | 'learning' | 'review' | 'relearning';
  reviewCount: number;
};

type Rating = 'again' | 'hard' | 'good' | 'easy';

const OWNER_ID = 'demo-user';
const convexUrl = import.meta.env.VITE_CONVEX_URL;

const ratingStyle: Record<Rating, string> = {
  again: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  hard: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100',
  good: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
  easy: 'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100',
};

function App() {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [showBack, setShowBack] = useState(false);

  const decks = useQuery(anyApi.flashcards.listDecks, { ownerId: OWNER_ID }) as Deck[] | undefined;
  const cards = useQuery(
    anyApi.flashcards.listCardsInDeck,
    selectedDeckId ? { ownerId: OWNER_ID, deckId: selectedDeckId } : 'skip',
  ) as Card[] | undefined;
  const dueCards = useQuery(
    anyApi.flashcards.listDueCards,
    selectedDeckId ? { ownerId: OWNER_ID, deckId: selectedDeckId } : 'skip',
  ) as DueCard[] | undefined;

  const createDeck = useMutation(anyApi.flashcards.createDeck);
  const createCard = useMutation(anyApi.flashcards.createCard);
  const reviewCard = useMutation(anyApi.flashcards.reviewCard);

  useEffect(() => {
    if (!decks || decks.length === 0) {
      setSelectedDeckId(null);
      return;
    }

    const hasCurrentDeck = selectedDeckId && decks.some((deck) => deck._id === selectedDeckId);
    if (!hasCurrentDeck) {
      setSelectedDeckId(decks[0]!._id);
    }
  }, [decks, selectedDeckId]);

  useEffect(() => {
    setShowBack(false);
  }, [selectedDeckId]);

  const currentCard = dueCards?.[0] ?? null;
  const deckCountLabel = useMemo(() => {
    if (!decks) return 'Loading decks...';
    return `${decks.length} deck${decks.length === 1 ? '' : 's'}`;
  }, [decks]);

  const handleCreateDeck = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedName = deckName.trim();
    if (!normalizedName) return;

    await createDeck({ ownerId: OWNER_ID, name: normalizedName, parentId: null });
    setDeckName('');
  };

  const handleCreateCard = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedDeckId) return;

    const trimmedFront = front.trim();
    const trimmedBack = back.trim();
    if (!trimmedFront || !trimmedBack) return;

    await createCard({
      ownerId: OWNER_ID,
      deckId: selectedDeckId,
      front: trimmedFront,
      back: trimmedBack,
    });

    setFront('');
    setBack('');
  };

  const handleRate = async (rating: Rating) => {
    if (!currentCard) return;
    await reviewCard({ ownerId: OWNER_ID, cardId: currentCard._id, rating });
    setShowBack(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-orange-100 px-4 py-8 text-stone-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight">Flashcards</h1>
          <p className="mt-2 text-sm text-stone-600">
            Spaced repetition with front/back cards and FSRS ratings.
          </p>
          {!convexUrl ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Missing `VITE_CONVEX_URL`. Add it to run live Convex data.
            </p>
          ) : null}
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-sm font-medium text-stone-700">Decks</p>
              <p className="text-xs text-stone-500">{deckCountLabel}</p>
            </div>

            <ul className="mb-5 space-y-2">
              {decks?.map((deck) => (
                <li key={deck._id}>
                  <button
                    onClick={() => setSelectedDeckId(deck._id)}
                    className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-left text-sm transition ${
                      selectedDeckId === deck._id
                        ? 'border-stone-700 bg-stone-900 text-stone-50'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {deck.name}
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleCreateDeck} className="space-y-2 border-t border-stone-200 pt-4">
              <label
                htmlFor="deck-name"
                className="block text-xs font-medium tracking-wide text-stone-500 uppercase"
              >
                New deck
              </label>
              <input
                id="deck-name"
                value={deckName}
                onChange={(event) => setDeckName(event.target.value)}
                placeholder="Linux Kernel"
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-stone-300 transition outline-none focus:ring-2"
              />
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
              >
                Create deck
              </button>
            </form>
          </aside>

          <div className="space-y-6">
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Cards</h2>
              <p className="mt-1 text-sm text-stone-600">Author cards in Markdown on both sides.</p>

              <form onSubmit={handleCreateCard} className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="block text-xs font-medium tracking-wide text-stone-500 uppercase">
                    Front
                  </span>
                  <textarea
                    value={front}
                    onChange={(event) => setFront(event.target.value)}
                    rows={4}
                    placeholder="What is virtual memory?"
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-stone-300 transition outline-none focus:ring-2"
                  />
                </label>

                <label className="space-y-1">
                  <span className="block text-xs font-medium tracking-wide text-stone-500 uppercase">
                    Back
                  </span>
                  <textarea
                    value={back}
                    onChange={(event) => setBack(event.target.value)}
                    rows={4}
                    placeholder="An abstraction that maps virtual addresses to physical memory."
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm ring-stone-300 transition outline-none focus:ring-2"
                  />
                </label>

                <button
                  type="submit"
                  disabled={!selectedDeckId}
                  className="cursor-pointer rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-stone-300 sm:col-span-2"
                >
                  Add card to deck
                </button>
              </form>

              <p className="mt-4 text-sm text-stone-600">
                {cards
                  ? `${cards.length} card${cards.length === 1 ? '' : 's'} in selected deck.`
                  : 'Loading cards...'}
              </p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Study</h2>
                  <p className="text-sm text-stone-600">
                    {dueCards
                      ? `${dueCards.length} due card${dueCards.length === 1 ? '' : 's'} in this deck.`
                      : 'Loading due cards...'}
                  </p>
                </div>
              </div>

              {currentCard ? (
                <div className="mt-4 space-y-4">
                  <article className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <p className="mb-2 text-xs font-medium tracking-wide text-stone-500 uppercase">
                      Front
                    </p>
                    <div className="text-sm leading-6 whitespace-pre-wrap text-stone-800">
                      {currentCard.front}
                    </div>

                    {showBack ? (
                      <>
                        <div className="my-4 border-t border-stone-200" />
                        <p className="mb-2 text-xs font-medium tracking-wide text-stone-500 uppercase">
                          Back
                        </p>
                        <div className="text-sm leading-6 whitespace-pre-wrap text-stone-800">
                          {currentCard.back}
                        </div>
                        <p className="mt-3 text-xs text-stone-500">
                          Phase: {currentCard.phase} | Reviews: {currentCard.reviewCount}
                        </p>
                      </>
                    ) : null}
                  </article>

                  {!showBack ? (
                    <button
                      onClick={() => setShowBack(true)}
                      className="cursor-pointer rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
                    >
                      Show answer
                    </button>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-4">
                      {(['again', 'hard', 'good', 'easy'] as const).map((rating) => (
                        <button
                          key={rating}
                          onClick={() => {
                            void handleRate(rating);
                          }}
                          className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${ratingStyle[rating]}`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-600">
                  No due cards. Add cards or switch deck.
                </p>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
