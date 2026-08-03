export type CardCategoryId =
  | 'grocery'
  | 'fashion'
  | 'dining'
  | 'pharmacy'
  | 'transit'
  | 'leisure'
  | 'home'
  | 'other';

export type CardCategory = {
  id: CardCategoryId;
  label: string;
  color: string;
};

export const CARD_CATEGORIES: CardCategory[] = [
  { id: 'grocery', label: 'Food', color: '#2F8F6B' },
  { id: 'fashion', label: 'Fashion', color: '#8B5A6B' },
  { id: 'dining', label: 'Dining', color: '#C45C3A' },
  { id: 'pharmacy', label: 'Pharmacy', color: '#3D7EA6' },
  { id: 'transit', label: 'Transit', color: '#5C6B8A' },
  { id: 'leisure', label: 'Leisure', color: '#6B5B95' },
  { id: 'home', label: 'Home', color: '#8A7A5C' },
  { id: 'other', label: 'Other', color: '#6B6760' },
];

export function categoryById(id: string | null | undefined): CardCategory | undefined {
  if (!id) return undefined;
  return CARD_CATEGORIES.find((c) => c.id === id);
}

export function categoryLabel(id: string | null | undefined): string {
  return categoryById(id)?.label ?? 'Uncategorized';
}
