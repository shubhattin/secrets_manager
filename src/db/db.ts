import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { drizzle as drizzle_neon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { get_db_url } from './db_utils';
// import { Redis } from '@upstash/redis';
import Redis from 'ioredis';

const DB_URL = get_db_url(env);

const get_drizzle_instance_dev = async () => {
  // using local postgres to allow edge environment in the edge
  const postgres = await import('postgres');
  const { drizzle } = await import('drizzle-orm/postgres-js');
  return drizzle(postgres.default(DB_URL), { schema });
};

export const db = import.meta.env.DEV
  ? await get_drizzle_instance_dev()
  : drizzle_neon(neon(DB_URL), { schema });

// const get_redis_instance_dev = async () => {
//   const Redis = (await import('ioredis')).default;
//   return new Redis(env.REDIS_DB_URL);
// };

// export const redis = import.meta.env.DEV
//   ? await get_redis_instance_dev()
//   : new Redis({
//       url: env.REDIS_URL,
//       token: env.REDIS_TOKEN
//     });

export const redis = new Redis(env.REDIS_DB_URL);
