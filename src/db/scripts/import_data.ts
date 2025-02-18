import { dbClient_ext as db, queryClient } from './client';
import { writeFile } from 'fs/promises';
import { dbMode, make_dir, take_input } from '~/tools/kry_server';

const main = async () => {
  if (!(await confirm_environemnt())) return;

  console.log(`Fetching Data from ${dbMode} Database...`);

  const user = await db.query.user.findMany();
  const account = await db.query.account.findMany();
  const categories = await db.query.categories.findMany();
  const items = await db.query.items.findMany();

  const json_data = {
    user,
    account,
    categories,
    items
  };

  await make_dir('./out');
  const out_file_name = {
    PROD: 'db_data_prod.json',
    PREVIEW: 'db_data_preview.json',
    LOCAL: 'db_data.json'
  }[dbMode];
  await writeFile(`./out/${out_file_name}`, JSON.stringify(json_data, null, 2));
};
main().then(() => {
  queryClient.end();
});

async function confirm_environemnt() {
  let confirmation: string = await take_input(`Are you sure SELECT from ${dbMode} ? `);
  if (['yes', 'y'].includes(confirmation)) return true;
  return false;
}
