import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, redis } from '../db/db';
import * as schema from '../db/schema';
import { env } from '$env/dynamic/private';
import { username } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    username({
      minUsernameLength: 4,
      maxUsernameLength: 20
    })
  ],
  secondaryStorage: {
    get: async (key) => {
      const value = (await redis.get(key)) as null | string;
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, 'EX', ttl);
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    }
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!
    }
  }
});
