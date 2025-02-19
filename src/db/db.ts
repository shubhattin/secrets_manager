import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { drizzle as drizzle_neon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { get_db_url } from './db_utils';
import { Redis } from '@upstash/redis';

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

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN
});
