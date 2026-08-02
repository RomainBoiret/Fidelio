import type { LoyaltyCard } from '@/domain/types';

export function filterCards(cards: LoyaltyCard[], query: string): LoyaltyCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return cards;

  return cards.filter((card) => {
    const haystack = [
      card.title,
      card.storeName,
      card.codeValue,
      card.notes ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
