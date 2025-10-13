import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    userId: v.id('users'),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workoutId = await ctx.db.insert('workouts', {
      userId: args.userId,
      name: args.name,
      startTime: Date.now(),
      createdAt: Date.now(),
    });

    return workoutId;
  },
});

export const finish = mutation({
  args: {
    id: v.id('workouts'),
  },
  handler: async (ctx, args) => {
    const workout = await ctx.db.get(args.id);
    if (!workout) {
      throw new ConvexError('Workout not found');
    }

    if (workout.endTime) {
      throw new ConvexError('Workout already finished');
    }

    const endTime = Date.now();
    const duration = endTime - workout.startTime;

    await ctx.db.patch(args.id, {
      endTime,
      duration,
    });

    return args.id;
  },
});

export const getByUser = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query('workouts')
      .withIndex('by_user_created', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(args.limit || 50);

    return workouts;
  },
});

export const getActive = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const activeWorkout = await ctx.db
      .query('workouts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('endTime'), undefined))
      .first();

    return activeWorkout;
  },
});

export const getWithSets = query({
  args: {
    id: v.id('workouts'),
  },
  handler: async (ctx, args) => {
    const workout = await ctx.db.get(args.id);
    if (!workout) {
      return null;
    }

    const sets = await ctx.db
      .query('sets')
      .withIndex('by_workout_order', (q) => q.eq('workoutId', args.id))
      .collect();

    // Get exercise details for each set
    const exerciseIds = [...new Set(sets.map((set) => set.exerciseId))];
    const exercises = await Promise.all(
      exerciseIds.map(async (exerciseId) => {
        const exercise = await ctx.db.get(exerciseId);
        return exercise;
      })
    );

    const exerciseMap = new Map(exercises.filter(Boolean).map((ex) => [ex!._id, ex]));

    return {
      ...workout,
      sets: sets.map((set) => ({
        ...set,
        exercise: exerciseMap.get(set.exerciseId),
      })),
    };
  },
});

export const remove = mutation({
  args: {
    id: v.id('workouts'),
  },
  handler: async (ctx, args) => {
    const workout = await ctx.db.get(args.id);
    if (!workout) {
      throw new ConvexError('Workout not found');
    }

    // Delete all sets associated with this workout
    const sets = await ctx.db
      .query('sets')
      .withIndex('by_workout', (q) => q.eq('workoutId', args.id))
      .collect();

    for (const set of sets) {
      await ctx.db.delete(set._id);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});