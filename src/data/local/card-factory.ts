import * as Crypto from 'expo-crypto';

import { CARD_ACCENTS, normalizeStoreName } from '@/domain/card';
import type {
  CreateLoyaltyCardInput,
  LoyaltyCard,
  UpdateLoyaltyCardInput,
} from '@/domain/types';

export function nowIso() {
  return new Date().toISOString();
}

export function buildCard(input: CreateLoyaltyCardInput): LoyaltyCard {
  const stamp = nowIso();
  const accent =
    input.accentColor ??
    CARD_ACCENTS[Math.floor(Math.random() * CARD_ACCENTS.length)]!;

  return {
    id: Crypto.randomUUID(),
    title: input.title.trim() || input.storeName.trim() || 'Card',
    storeName: normalizeStoreName(input.storeName) || 'Store',
    codeValue: input.codeValue.trim(),
    codeFormat: input.codeFormat ?? 'unknown',
    notes: input.notes?.trim() || null,
    categoryId: input.categoryId ?? null,
    accentColor: accent,
    isFavorite: input.isFavorite ?? false,
    lastOpenedAt: null,
    createdAt: stamp,
    updatedAt: stamp,
    deletedAt: null,
  };
}

export function applyCardUpdate(
  existing: LoyaltyCard,
  input: UpdateLoyaltyCardInput,
): LoyaltyCard {
  return {
    ...existing,
    title:
      input.title !== undefined
        ? input.title.trim() || existing.title
        : existing.title,
    storeName:
      input.storeName !== undefined
        ? normalizeStoreName(input.storeName) || existing.storeName
        : existing.storeName,
    codeValue:
      input.codeValue !== undefined
        ? input.codeValue.trim() || existing.codeValue
        : existing.codeValue,
    codeFormat: input.codeFormat ?? existing.codeFormat,
    notes:
      input.notes === undefined ? existing.notes : input.notes?.trim() || null,
    categoryId:
      input.categoryId === undefined ? existing.categoryId : input.categoryId,
    accentColor:
      input.accentColor === undefined
        ? existing.accentColor
        : input.accentColor,
    isFavorite:
      input.isFavorite === undefined ? existing.isFavorite : input.isFavorite,
    lastOpenedAt:
      input.lastOpenedAt === undefined
        ? existing.lastOpenedAt
        : input.lastOpenedAt,
    updatedAt: nowIso(),
  };
}

/** Normalize cards loaded from older storage shapes. */
export function normalizeCard(raw: Partial<LoyaltyCard> & Pick<LoyaltyCard, 'id'>): LoyaltyCard {
  return {
    id: raw.id,
    title: raw.title ?? 'Card',
    storeName: raw.storeName ?? 'Store',
    codeValue: raw.codeValue ?? '',
    codeFormat: raw.codeFormat ?? 'unknown',
    notes: raw.notes ?? null,
    categoryId: raw.categoryId ?? null,
    accentColor: raw.accentColor ?? null,
    isFavorite: Boolean(raw.isFavorite),
    lastOpenedAt: raw.lastOpenedAt ?? null,
    createdAt: raw.createdAt ?? nowIso(),
    updatedAt: raw.updatedAt ?? nowIso(),
    deletedAt: raw.deletedAt ?? null,
  };
}
