import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const reviewRating = v.union(
  v.literal('again'),
  v.literal('hard'),
  v.literal('good'),
  v.literal('easy'),
);

const createDeckArgs = {
  ownerId: v.string(),
  name: v.string(),
  parentId: v.optional(v.union(v.id('catalogNodes'), v.null())),
};

const createCardArgs = {
  ownerId: v.string(),
  deckId: v.id('catalogNodes'),
  front: v.string(),
  back: v.string(),
};

const listDecksArgs = {
  ownerId: v.string(),
};

const listCardsArgs = {
  ownerId: v.string(),
  deckId: v.id('catalogNodes'),
};

const reviewCardArgs = {
  ownerId: v.string(),
  cardId: v.id('cards'),
  rating: reviewRating,
};

export const listDecks = query({
  args: listDecksArgs,
  handler: async (ctx, args) => {
    const decks = await ctx.db
      .query('catalogNodes')
      .withIndex('by_owner_type', (q) => q.eq('ownerId', args.ownerId).eq('type', 'deck'))
      .collect();

    return decks.filter((deck) => !deck.isArchived).sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const createDeck = mutation({
  args: createDeckArgs,
  handler: async (ctx, args) => {
    const now = Date.now();
    const parentId = args.parentId ?? null;
    const siblings = await ctx.db
      .query('catalogNodes')
      .withIndex('by_owner_parent', (q) => q.eq('ownerId', args.ownerId).eq('parentId', parentId))
      .collect();

    return await ctx.db.insert('catalogNodes', {
      ownerId: args.ownerId,
      type: 'deck',
      name: args.name.trim(),
      parentId,
      position: siblings.length,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listCardsInDeck = query({
  args: listCardsArgs,
  handler: async (ctx, args) => {
    const cards = await ctx.db
      .query('cards')
      .withIndex('by_owner_deck', (q) => q.eq('ownerId', args.ownerId).eq('deckId', args.deckId))
      .collect();

    return cards.filter((card) => !card.isArchived);
  },
});

export const listDueCards = query({
  args: listCardsArgs,
  handler: async (ctx, args) => {
    const now = Date.now();
    const cards = await ctx.db
      .query('cards')
      .withIndex('by_owner_deck', (q) => q.eq('ownerId', args.ownerId).eq('deckId', args.deckId))
      .collect();

    const activeCards = cards.filter((card) => !card.isArchived);
    const dueCards: Array<{
      _id: (typeof activeCards)[number]['_id'];
      _creationTime: number;
      ownerId: string;
      deckId: typeof args.deckId;
      front: string;
      back: string;
      isArchived: boolean;
      createdAt: number;
      updatedAt: number;
      dueAt: number;
      phase: 'new' | 'learning' | 'review' | 'relearning';
      reviewCount: number;
    }> = [];

    for (const card of activeCards) {
      const cardState = await ctx.db
        .query('cardStates')
        .withIndex('by_owner_card', (q) => q.eq('ownerId', args.ownerId).eq('cardId', card._id))
        .first();

      if (!cardState || cardState.dueAt <= now) {
        dueCards.push({
          ...card,
          dueAt: cardState?.dueAt ?? now,
          phase: cardState?.phase ?? 'new',
          reviewCount: cardState?.reviewCount ?? 0,
        });
      }
    }

    return dueCards.sort((a, b) => a.dueAt - b.dueAt);
  },
});

export const createCard = mutation({
  args: createCardArgs,
  handler: async (ctx, args) => {
    const deck = await ctx.db.get(args.deckId);
    if (!deck || deck.ownerId !== args.ownerId || deck.type !== 'deck' || deck.isArchived) {
      throw new Error('Deck not found');
    }

    const now = Date.now();
    return await ctx.db.insert('cards', {
      ownerId: args.ownerId,
      deckId: args.deckId,
      front: args.front.trim(),
      back: args.back.trim(),
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const reviewCard = mutation({
  args: reviewCardArgs,
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card || card.ownerId !== args.ownerId || card.isArchived) {
      throw new Error('Card not found');
    }

    const now = Date.now();
    await ctx.db.insert('reviews', {
      ownerId: args.ownerId,
      cardId: card._id,
      reviewedAt: now,
      rating: args.rating,
    });

    const existingState = await ctx.db
      .query('cardStates')
      .withIndex('by_owner_card', (q) => q.eq('ownerId', args.ownerId).eq('cardId', card._id))
      .first();

    const baseState = existingState ?? {
      ownerId: args.ownerId,
      cardId: card._id,
      dueAt: now,
      lastReviewedAt: null,
      stability: 1,
      difficulty: 5,
      reviewCount: 0,
      lapseCount: 0,
      phase: 'new' as const,
      desiredRetention: 0.9,
      createdAt: now,
      updatedAt: now,
    };

    let intervalMs = 24 * 60 * 60 * 1000;
    let nextPhase = baseState.phase;
    let stability = baseState.stability;
    let difficulty = baseState.difficulty;
    let lapseCount = baseState.lapseCount;

    switch (args.rating) {
      case 'again': {
        intervalMs = 60 * 60 * 1000;
        nextPhase = 'relearning';
        stability = Math.max(0.5, baseState.stability * 0.6);
        difficulty = Math.min(10, baseState.difficulty + 0.8);
        lapseCount += 1;
        break;
      }
      case 'hard': {
        intervalMs = Math.max(1, Math.round(baseState.stability * 1.2)) * 24 * 60 * 60 * 1000;
        nextPhase = baseState.reviewCount < 2 ? 'learning' : 'review';
        stability = Math.max(0.7, baseState.stability * 1.1);
        difficulty = Math.min(10, baseState.difficulty + 0.2);
        break;
      }
      case 'good': {
        intervalMs = Math.max(2, Math.round(baseState.stability * 2)) * 24 * 60 * 60 * 1000;
        nextPhase = 'review';
        stability = Math.max(1, baseState.stability * 1.5);
        difficulty = Math.max(1, baseState.difficulty - 0.15);
        break;
      }
      case 'easy': {
        intervalMs = Math.max(4, Math.round(baseState.stability * 3.5)) * 24 * 60 * 60 * 1000;
        nextPhase = 'review';
        stability = Math.max(1.2, baseState.stability * 1.9);
        difficulty = Math.max(1, baseState.difficulty - 0.4);
        break;
      }
    }

    const updatedState = {
      ...baseState,
      dueAt: now + intervalMs,
      lastReviewedAt: now,
      stability,
      difficulty,
      reviewCount: baseState.reviewCount + 1,
      lapseCount,
      phase: nextPhase,
      updatedAt: now,
    };

    if (existingState) {
      await ctx.db.patch(existingState._id, updatedState);
    } else {
      await ctx.db.insert('cardStates', updatedState);
    }

    return {
      dueAt: updatedState.dueAt,
      phase: updatedState.phase,
      reviewCount: updatedState.reviewCount,
    };
  },
});
