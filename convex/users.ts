import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existingUser) {
      throw new ConvexError('User already exists');
    }

    const userId = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const getCurrentUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    return user;
  },
});

export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError('User not found');
    }

    const updates: Partial<typeof args> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});