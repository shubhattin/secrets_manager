import { dbClient_ext as db, queryClient } from './client';
import { readFile } from 'fs/promises';
import { dbMode, take_input } from '~/tools/kry_server';
import { categories, items, users } from '~/db/schema';
import { CategoriesSchemaZod, ItemsSchemaZod, UsersSchemaZod } from '~/db/schema_zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

const main = async () => {
  /*
   Better backup & restore tools like `pg_dump` and `pg_restore` should be used.
  
   Although Here the foriegn key relations are not that complex so we are doing it manually
  */
  if (!(await confirm_environemnt())) return;

  console.log(`Insering Data into ${dbMode} Database...`);

  const in_file_name = {
    PROD: 'db_data_prod.json',
    PREVIEW: 'db_data_preview.json',
    LOCAL: 'db_data.json'
  }[dbMode];

  const data = z
    .object({
      users: UsersSchemaZod.array(),
      categories: CategoriesSchemaZod.array(),
      items: ItemsSchemaZod.array()
    })
    .parse(JSON.parse((await readFile(`./out/${in_file_name}`)).toString()));

  // insertig users
  try {
    await db.delete(users);
    await db.insert(users).values(data.users);
    // resetting the SERIAL
    await db.execute(sql`SELECT setval('users_id_seq', (select MAX(id) from users))`);
    console.log('Successfully added values into table `users`');
  } catch {
    console.log('Failed to add values into table `users`');
  }

  // insertig categories
  try {
    await db.delete(categories);
    await db.insert(categories).values(data.categories);
    // resetting the SERIAL
    await db.execute(sql`SELECT setval('categories_id_seq', (select MAX(id) from categories))`);
    console.log('Successfully added values into table `categories`');
  } catch {
    console.log('Failed to add values into table `categories`');
  }

  // insertig items
  try {
    await db.delete(items);
    await db.insert(items).values(data.items);
    // resetting the SERIAL
    await db.execute(sql`SELECT setval('items_id_seq', (select MAX(id) from items))`);
    console.log('Successfully added values into table `items`');
  } catch {
    console.log('Failed to add values into table `items`');
  }
};
main().then(() => {
  queryClient.end();
});

async function confirm_environemnt() {
  let confirmation: string = await take_input(`Are you sure INSERT in ${dbMode} ? `);
  if (['yes', 'y'].includes(confirmation)) return true;
  return false;
}
