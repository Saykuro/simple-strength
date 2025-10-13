import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    trackingComponents: v.object({
      weight: v.boolean(),
      reps: v.boolean(),
      time: v.boolean(),
      distance: v.boolean(),
      notes: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const exerciseId = await ctx.db.insert('exercises', {
      userId: args.userId,
      name: args.name,
      trackingComponents: args.trackingComponents,
      createdAt: Date.now(),
      isArchived: false,
    });

    return exerciseId;
  },
});

export const getByUser = query({
  args: {
    userId: v.id('users'),
    includeArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.includeArchived) {
      return await ctx.db
        .query('exercises')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .collect();
    }

    return await ctx.db
      .query('exercises')
      .withIndex('by_user_active', (q) => q.eq('userId', args.userId).eq('isArchived', false))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id('exercises'),
    name: v.optional(v.string()),
    trackingComponents: v.optional(
      v.object({
        weight: v.boolean(),
        reps: v.boolean(),
        time: v.boolean(),
        distance: v.boolean(),
        notes: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const exercise = await ctx.db.get(id);
    if (!exercise) {
      throw new ConvexError('Exercise not found');
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

export const archive = mutation({
  args: {
    id: v.id('exercises'),
  },
  handler: async (ctx, args) => {
    const exercise = await ctx.db.get(args.id);
    if (!exercise) {
      throw new ConvexError('Exercise not found');
    }

    await ctx.db.patch(args.id, { isArchived: true });
    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('exercises'),
  },
  handler: async (ctx, args) => {
    const exercise = await ctx.db.get(args.id);
    if (!exercise) {
      throw new ConvexError('Exercise not found');
    }

    // Check if exercise is used in any sets
    const setsWithExercise = await ctx.db
      .query('sets')
      .withIndex('by_exercise', (q) => q.eq('exerciseId', args.id))
      .first();

    if (setsWithExercise) {
      throw new ConvexError('Cannot delete exercise that has been used in workouts. Archive it instead.');
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});