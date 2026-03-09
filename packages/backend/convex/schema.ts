import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const nodeType = v.union(v.literal('catalog'), v.literal('deck'));

const reviewRating = v.union(
  v.literal('again'),
  v.literal('hard'),
  v.literal('good'),
  v.literal('easy'),
);

const learningPhase = v.union(
  v.literal('new'),
  v.literal('learning'),
  v.literal('review'),
  v.literal('relearning'),
);

export default defineSchema({
  catalogNodes: defineTable({
    ownerId: v.string(),
    type: nodeType,
    name: v.string(),
    parentId: v.union(v.id('catalogNodes'), v.null()),
    position: v.number(),
    isArchived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner_parent', ['ownerId', 'parentId'])
    .index('by_owner_type', ['ownerId', 'type'])
    .index('by_owner_parent_name', ['ownerId', 'parentId', 'name']),

  cards: defineTable({
    ownerId: v.string(),
    deckId: v.id('catalogNodes'),
    front: v.string(),
    back: v.string(),
    isArchived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner_deck', ['ownerId', 'deckId'])
    .index('by_deck', ['deckId'])
    .index('by_owner', ['ownerId']),

  cardStates: defineTable({
    ownerId: v.string(),
    cardId: v.id('cards'),

    dueAt: v.number(),
    lastReviewedAt: v.union(v.number(), v.null()),

    stability: v.number(),
    difficulty: v.number(),

    reviewCount: v.number(),
    lapseCount: v.number(),

    phase: learningPhase,
    desiredRetention: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner_dueAt', ['ownerId', 'dueAt'])
    .index('by_owner_card', ['ownerId', 'cardId'])
    .index('by_card', ['cardId']),

  reviews: defineTable({
    ownerId: v.string(),
    cardId: v.id('cards'),
    reviewedAt: v.number(),
    rating: reviewRating,
  })
    .index('by_owner_reviewedAt', ['ownerId', 'reviewedAt'])
    .index('by_card_reviewedAt', ['cardId', 'reviewedAt']),
});
