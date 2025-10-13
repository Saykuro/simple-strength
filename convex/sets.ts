import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    workoutId: v.id('workouts'),
    exerciseId: v.id('exercises'),
    weight: v.optional(v.number()),
    reps: v.optional(v.number()),
    time: v.optional(v.number()),
    distance: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the current number of sets for this workout to determine order
    const existingSets = await ctx.db
      .query('sets')
      .withIndex('by_workout', (q) => q.eq('workoutId', args.workoutId))
      .collect();

    const order = existingSets.length;

    const setId = await ctx.db.insert('sets', {
      workoutId: args.workoutId,
      exerciseId: args.exerciseId,
      weight: args.weight,
      reps: args.reps,
      time: args.time,
      distance: args.distance,
      notes: args.notes,
      createdAt: Date.now(),
      order,
    });

    return setId;
  },
});

export const getByWorkout = query({
  args: {
    workoutId: v.id('workouts'),
  },
  handler: async (ctx, args) => {
    const sets = await ctx.db
      .query('sets')
      .withIndex('by_workout_order', (q) => q.eq('workoutId', args.workoutId))
      .collect();

    return sets;
  },
});

export const getByExercise = query({
  args: {
    exerciseId: v.id('exercises'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const sets = await ctx.db
      .query('sets')
      .withIndex('by_exercise', (q) => q.eq('exerciseId', args.exerciseId))
      .order('desc')
      .take(args.limit || 50);

    return sets;
  },
});

export const getLastByExercise = query({
  args: {
    exerciseId: v.id('exercises'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Get the most recent set for this exercise by this user
    const sets = await ctx.db
      .query('sets')
      .withIndex('by_exercise', (q) => q.eq('exerciseId', args.exerciseId))
      .order('desc')
      .collect();

    // Filter by user through workout relationship
    for (const set of sets) {
      const workout = await ctx.db.get(set.workoutId);
      if (workout && workout.userId === args.userId) {
        return set;
      }
    }

    return null;
  },
});

export const update = mutation({
  args: {
    id: v.id('sets'),
    weight: v.optional(v.number()),
    reps: v.optional(v.number()),
    time: v.optional(v.number()),
    distance: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const set = await ctx.db.get(id);
    if (!set) {
      throw new ConvexError('Set not found');
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('sets'),
  },
  handler: async (ctx, args) => {
    const set = await ctx.db.get(args.id);
    if (!set) {
      throw new ConvexError('Set not found');
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});