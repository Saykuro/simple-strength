import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index('by_clerk_id', ['clerkId']),

  exercises: defineTable({
    userId: v.id('users'),
    name: v.string(),
    trackingComponents: v.object({
      weight: v.boolean(),
      reps: v.boolean(),
      time: v.boolean(),
      distance: v.boolean(),
      notes: v.boolean(),
    }),
    createdAt: v.number(),
    isArchived: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_user_active', ['userId', 'isArchived']),

  workouts: defineTable({
    userId: v.id('users'),
    name: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_created', ['userId', 'createdAt']),

  sets: defineTable({
    workoutId: v.id('workouts'),
    exerciseId: v.id('exercises'),
    weight: v.optional(v.number()),
    reps: v.optional(v.number()),
    time: v.optional(v.number()),
    distance: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    order: v.number(),
  })
    .index('by_workout', ['workoutId'])
    .index('by_exercise', ['exerciseId'])
    .index('by_workout_order', ['workoutId', 'order']),
});