import type { LoyaltyCard } from '@/domain/types';

/** Zero-padded collection catalogue number (e.g. 004). */
export function formatCollectionNo(n: number): string {
  return String(Math.max(1, n)).padStart(3, '0');
}

export function collectionLabel(n: number): string {
  return `Collection No. ${formatCollectionNo(n)}`;
}

export function piecesLabel(count: number): string {
  if (count === 0) return '0 PIECES';
  if (count === 1) return '01 PIECE';
  return `${String(count).padStart(2, '0')} PIECES`;
}

export function addedYear(iso: string): string {
  return String(new Date(iso).getFullYear());
}

export function addedMonthDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });
}

export function relativeUseLabel(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function maskCode(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 4) return trimmed;
  return `•••• ${trimmed.slice(-4)}`;
}

/** Stable catalogue index from position in current collection (1-based). */
export function catalogueIndex(cards: LoyaltyCard[], cardId: string): number {
  const i = cards.findIndex((c) => c.id === cardId);
  return i >= 0 ? i + 1 : 1;
}
