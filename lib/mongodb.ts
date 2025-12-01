// lib/mongodb.ts
// Centralized MongoDB connection for a Next.js + TypeScript app using Mongoose.
// - Uses a global cached connection to avoid creating multiple connections in development
//   (Next.js hot reloading can re-run modules).
// - Strongly typed: no use of `any`.
// - Throws early if MONGODB_URI is missing to fail fast during boot.

import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

// Read the connection string from environment variables.
// Keep secrets in .env (never commit sensitive values to source control).
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment. Set it in your .env file.');
}

// In development, use a global cached connection to prevent creating multiple
// connections due to module reloads.
// We augment the NodeJS global type to include our cache object.
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line no-var
  var __mongoose__: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

// Initialize the cache on the global object if it doesn't exist yet.
const cached = global.__mongoose__ || (global.__mongoose__ = { conn: null, promise: null });

/**
 * Establishes (or returns) a cached Mongoose connection to MongoDB.
 * - In production this behaves normally (single connection).
 * - In development it reuses the same connection between hot reloads.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: ConnectOptions = {
      // Disable mongoose command buffering so that operations fail fast
      // if the connection is not ready.
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, options).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Optional helper that returns the current Mongoose instance if already connected,
 * otherwise returns null. Useful in edge cases where you need to check state.
 */
export function getMongoose(): Mongoose | null {
  return cached.conn;
}

export default connectToDatabase;