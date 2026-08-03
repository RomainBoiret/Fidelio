import * as SQLite from 'expo-sqlite';

import {
  applyCardUpdate,
  buildCard,
  normalizeCard,
  nowIso,
} from '@/data/local/card-factory';
import { CARD_CATEGORIES } from '@/domain/categories';
import type {
  CreateLoyaltyCardInput,
  LoyaltyCard,
  UpdateLoyaltyCardInput,
} from '@/domain/types';

const DB_NAME = 'fidelio.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function migrateColumns(db: SQLite.SQLiteDatabase) {
  const cols = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(cards)`);
  const names = new Set(cols.map((c) => c.name));
  if (!names.has('is_favorite')) {
    await db.execAsync(
      `ALTER TABLE cards ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0`,
    );
  }
  if (!names.has('last_opened_at')) {
    await db.execAsync(`ALTER TABLE cards ADD COLUMN last_opened_at TEXT`);
  }
}

async function seedCategories(db: SQLite.SQLiteDatabase) {
  const stamp = nowIso();
  for (const cat of CARD_CATEGORIES) {
    await db.runAsync(
      `INSERT OR IGNORE INTO categories (id, name, color, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, NULL)`,
      [cat.id, cat.label, cat.color, stamp, stamp],
    );
  }
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );

        CREATE TABLE IF NOT EXISTS cards (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          store_name TEXT NOT NULL,
          code_value TEXT NOT NULL,
          code_format TEXT NOT NULL,
          notes TEXT,
          category_id TEXT,
          accent_color TEXT,
          is_favorite INTEGER NOT NULL DEFAULT 0,
          last_opened_at TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE INDEX IF NOT EXISTS idx_cards_updated ON cards(updated_at);
        CREATE INDEX IF NOT EXISTS idx_cards_store ON cards(store_name);
      `);
      await migrateColumns(db);
      await seedCategories(db);
      return db;
    })();
  }
  return dbPromise;
}

function mapCard(row: Record<string, unknown>): LoyaltyCard {
  return normalizeCard({
    id: String(row.id),
    title: String(row.title),
    storeName: String(row.store_name),
    codeValue: String(row.code_value),
    codeFormat: row.code_format as LoyaltyCard['codeFormat'],
    notes: row.notes == null ? null : String(row.notes),
    categoryId: row.category_id == null ? null : String(row.category_id),
    accentColor: row.accent_color == null ? null : String(row.accent_color),
    isFavorite: Number(row.is_favorite ?? 0) === 1,
    lastOpenedAt: row.last_opened_at == null ? null : String(row.last_opened_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    deletedAt: row.deleted_at == null ? null : String(row.deleted_at),
  });
}

export async function listCards(): Promise<LoyaltyCard[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM cards WHERE deleted_at IS NULL
     ORDER BY COALESCE(last_opened_at, updated_at) DESC`,
  );
  return rows.map(mapCard);
}

export async function getCard(id: string): Promise<LoyaltyCard | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM cards WHERE id = ? AND deleted_at IS NULL`,
    [id],
  );
  return row ? mapCard(row) : null;
}

export async function createCard(
  input: CreateLoyaltyCardInput,
): Promise<LoyaltyCard> {
  const db = await getDb();
  const card = buildCard(input);

  await db.runAsync(
    `INSERT INTO cards (
      id, title, store_name, code_value, code_format, notes,
      category_id, accent_color, is_favorite, last_opened_at,
      created_at, updated_at, deleted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    [
      card.id,
      card.title,
      card.storeName,
      card.codeValue,
      card.codeFormat,
      card.notes,
      card.categoryId,
      card.accentColor,
      card.isFavorite ? 1 : 0,
      card.lastOpenedAt,
      card.createdAt,
      card.updatedAt,
    ],
  );

  return card;
}

export async function updateCard(
  id: string,
  input: UpdateLoyaltyCardInput,
): Promise<LoyaltyCard | null> {
  const existing = await getCard(id);
  if (!existing) return null;

  const next = applyCardUpdate(existing, input);
  const db = await getDb();
  await db.runAsync(
    `UPDATE cards SET
      title = ?, store_name = ?, code_value = ?, code_format = ?,
      notes = ?, category_id = ?, accent_color = ?,
      is_favorite = ?, last_opened_at = ?, updated_at = ?
     WHERE id = ?`,
    [
      next.title,
      next.storeName,
      next.codeValue,
      next.codeFormat,
      next.notes,
      next.categoryId,
      next.accentColor,
      next.isFavorite ? 1 : 0,
      next.lastOpenedAt,
      next.updatedAt,
      id,
    ],
  );

  return next;
}

export async function softDeleteCard(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE cards SET deleted_at = ?, updated_at = ? WHERE id = ?`,
    [nowIso(), nowIso(), id],
  );
}

export async function ensureReady(): Promise<void> {
  await getDb();
}
