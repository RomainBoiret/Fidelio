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

export function favoriteCards(cards: LoyaltyCard[]): LoyaltyCard[] {
  return cards.filter((c) => c.isFavorite);
}
