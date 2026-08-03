import type { CreateLoyaltyCardInput } from '@/domain/types';

/** Credible sample loyalty cards for first-run / empty vault demos. */
export const DEMO_CARDS: CreateLoyaltyCardInput[] = [
  {
    title: 'Moi Rewards',
    storeName: 'Metro',
    codeValue: '62841092841',
    codeFormat: 'code128',
    notes: 'Show at self-checkout',
    accentColor: '#1A3A6B',
    categoryId: 'grocery',
    isFavorite: true,
  },
  {
    title: 'Rewards Club',
    storeName: 'Café Luna',
    codeValue: '4829103746512',
    codeFormat: 'ean13',
    notes: 'Free drink every 8 stamps',
    accentColor: '#C45C3A',
    categoryId: 'dining',
    isFavorite: true,
  },
  {
    title: 'Member pass',
    storeName: 'GreenMarket Organic',
    codeValue: 'LM-88402159',
    codeFormat: 'code128',
    notes: 'Produce aisle',
    accentColor: '#2F8F6B',
    categoryId: 'grocery',
  },
  {
    title: 'Reader card',
    storeName: 'Book Nook',
    codeValue: '0093847561',
    codeFormat: 'code39',
    accentColor: '#5C4A7A',
    categoryId: 'leisure',
  },
  {
    title: 'Loyalty card',
    storeName: 'Atelier Nord',
    codeValue: 'ATN-2026-0042',
    codeFormat: 'code128',
    notes: 'Seasonal pass',
    accentColor: '#8A7A5C',
    categoryId: 'fashion',
  },
  {
    title: 'Points card',
    storeName: 'Station 12',
    codeValue: '1200488177',
    codeFormat: 'upc_a',
    categoryId: 'transit',
  },
];
