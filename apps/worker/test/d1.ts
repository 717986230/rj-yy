import Database from 'better-sqlite3';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** 测试用：用 better-sqlite3 模拟本项目用到的那一小部分 D1 接口，并执行全部迁移 */
export function memoryD1(): D1Database {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  const dir = join(import.meta.dirname, '../migrations');
  for (const f of readdirSync(dir).sort()) db.exec(readFileSync(join(dir, f), 'utf8'));

  const statement = (sql: string, params: unknown[] = []) => {
    const stmt = db.prepare(sql);
    return {
      bind: (...p: unknown[]) => statement(sql, p),
      first: async () => (stmt.reader ? (stmt.get(...params) ?? null) : null),
      all: async () => ({ results: stmt.all(...params), success: true, meta: {} }),
      run: async () => {
        if (stmt.reader) stmt.all(...params);
        else stmt.run(...params);
        return { success: true, meta: {} };
      },
    };
  };
  return { prepare: (sql: string) => statement(sql) } as unknown as D1Database;
}
