import { createApp } from './app';
import { loadConfig } from './config';
import { openDatabase } from './db';

const config = loadConfig();
const db = openDatabase(config.databaseFile);
const app = createApp(db, config);

app.listen(config.port, () => {
  console.log(`Vido API 已启动：http://localhost:${config.port}/api`);
});
