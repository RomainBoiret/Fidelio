import type { LoyaltyCard } from '@/domain/types';

export function filterCards(cards: LoyaltyCard[], query: string): LoyaltyCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return cards;
  return cards.filter((card) => {
    const hay = [
      card.title,
      card.storeName,
      card.codeValue,
      card.notes ?? '',
      card.categoryId ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export type CardsFilter = 'all' | 'favorites' | 'recent' | string;

export function applyCardsFilter(
  cards: LoyaltyCard[],
  filter: CardsFilter,
): LoyaltyCard[] {
  if (filter === 'all') return cards;
  if (filter === 'favorites') return cards.filter((c) => c.isFavorite);
  if (filter === 'recent') {
    return [...cards]
      .sort((a, b) => {
        const aKey = a.lastOpenedAt ?? a.updatedAt;
        const bKey = b.lastOpenedAt ?? b.updatedAt;
        return bKey.localeCompare(aKey);
      })
      .slice(0, 12);
  }
  // category id
  return cards.filter((c) => c.categoryId === filter);
}

export function sortCardsAlpha(cards: LoyaltyCard[]): LoyaltyCard[] {
  return [...cards].sort((a, b) =>
    a.storeName.localeCompare(b.storeName, undefined, { sensitivity: 'base' }),
  );
}

export function mostRecentCard(cards: LoyaltyCard[]): LoyaltyCard | undefined {
  if (cards.length === 0) return undefined;
  return [...cards].sort((a, b) => {
    const aKey = a.lastOpenedAt ?? a.updatedAt;
    const bKey = b.lastOpenedAt ?? b.updatedAt;
    return bKey.localeCompare(aKey);
  })[0];
}

export function favoriteCards(cards: LoyaltyCard[]): LoyaltyCard[] {
  return cards.filter((c) => c.isFavorite);
}

export function recentlyAdded(cards: LoyaltyCard[], limit = 4): LoyaltyCard[] {
  return [...cards]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
