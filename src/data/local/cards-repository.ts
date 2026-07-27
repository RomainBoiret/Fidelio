import * as SQLite from 'expo-sqlite';

import {
  applyCardUpdate,
  buildCard,
  nowIso,
} from '@/data/local/card-factory';
import type {
  Category,
  CreateLoyaltyCardInput,
  LoyaltyCard,
  UpdateLoyaltyCardInput,
} from '@/domain/types';

const DB_NAME = 'fidelio.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

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
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE INDEX IF NOT EXISTS idx_cards_updated ON cards(updated_at);
        CREATE INDEX IF NOT EXISTS idx_cards_store ON cards(store_name);
      `);
      return db;
    })();
  }
  return dbPromise;
}

function mapCard(row: Record<string, unknown>): LoyaltyCard {
  return {
    id: String(row.id),
    title: String(row.title),
    storeName: String(row.store_name),
    codeValue: String(row.code_value),
    codeFormat: row.code_format as LoyaltyCard['codeFormat'],
    notes: row.notes == null ? null : String(row.notes),
    categoryId: row.category_id == null ? null : String(row.category_id),
    accentColor: row.accent_color == null ? null : String(row.accent_color),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    deletedAt: row.deleted_at == null ? null : String(row.deleted_at),
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name),
    color: String(row.color),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    deletedAt: row.deleted_at == null ? null : String(row.deleted_at),
  };
}

export async function listCards(): Promise<LoyaltyCard[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM cards WHERE deleted_at IS NULL ORDER BY updated_at DESC`,
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
      category_id, accent_color, created_at, updated_at, deleted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    [
      card.id,
      card.title,
      card.storeName,
      card.codeValue,
      card.codeFormat,
      card.notes,
      card.categoryId,
      card.accentColor,
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
      notes = ?, category_id = ?, accent_color = ?, updated_at = ?
     WHERE id = ?`,
    [
      next.title,
      next.storeName,
      next.codeValue,
      next.codeFormat,
      next.notes,
      next.categoryId,
      next.accentColor,
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

export async function listCategories(): Promise<Category[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC`,
  );
  return rows.map(mapCategory);
}

export async function ensureReady(): Promise<void> {
  await getDb();
}
