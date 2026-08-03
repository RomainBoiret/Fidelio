/**
 * Web storage fallback.
 * Avoids expo-sqlite's wa-sqlite.wasm while keeping the same repository API.
 */
import {
  applyCardUpdate,
  buildCard,
  normalizeCard,
  nowIso,
} from '@/data/local/card-factory';
import type {
  Category,
  CreateLoyaltyCardInput,
  LoyaltyCard,
  UpdateLoyaltyCardInput,
} from '@/domain/types';

const STORAGE_KEY = 'fidelio.cards.v2';

type StoreShape = {
  cards: LoyaltyCard[];
  categories: Category[];
};

function readStore(): StoreShape {
  if (typeof localStorage === 'undefined') {
    return { cards: [], categories: [] };
  }
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem('fidelio.cards.v1');
    if (!raw) return { cards: [], categories: [] };
    const parsed = JSON.parse(raw) as StoreShape;
    return {
      cards: Array.isArray(parsed.cards)
        ? parsed.cards.map((c) => normalizeCard(c))
        : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
    };
  } catch {
    return { cards: [], categories: [] };
  }
}

function writeStore(store: StoreShape) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function listCards(): Promise<LoyaltyCard[]> {
  return readStore()
    .cards.filter((card) => card.deletedAt == null)
    .sort((a, b) => {
      const aKey = a.lastOpenedAt ?? a.updatedAt;
      const bKey = b.lastOpenedAt ?? b.updatedAt;
      return bKey.localeCompare(aKey);
    });
}

export async function getCard(id: string): Promise<LoyaltyCard | null> {
  return (
    readStore().cards.find(
      (card) => card.id === id && card.deletedAt == null,
    ) ?? null
  );
}

export async function createCard(
  input: CreateLoyaltyCardInput,
): Promise<LoyaltyCard> {
  const store = readStore();
  const card = buildCard(input);
  store.cards = [card, ...store.cards];
  writeStore(store);
  return card;
}

export async function updateCard(
  id: string,
  input: UpdateLoyaltyCardInput,
): Promise<LoyaltyCard | null> {
  const store = readStore();
  const index = store.cards.findIndex(
    (card) => card.id === id && card.deletedAt == null,
  );
  if (index < 0) return null;

  const next = applyCardUpdate(store.cards[index]!, input);
  store.cards[index] = next;
  writeStore(store);
  return next;
}

export async function softDeleteCard(id: string): Promise<void> {
  const store = readStore();
  const stamp = nowIso();
  store.cards = store.cards.map((card) =>
    card.id === id
      ? { ...card, deletedAt: stamp, updatedAt: stamp }
      : card,
  );
  writeStore(store);
}

export async function ensureReady(): Promise<void> {
  readStore();
}
