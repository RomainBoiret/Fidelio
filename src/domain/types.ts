export type BarcodeFormat =
  | 'qr'
  | 'ean13'
  | 'ean8'
  | 'code128'
  | 'code39'
  | 'upc_a'
  | 'upc_e'
  | 'itf14'
  | 'codabar'
  | 'pdf417'
  | 'aztec'
  | 'unknown';

export type LoyaltyCard = {
  id: string;
  title: string;
  storeName: string;
  codeValue: string;
  codeFormat: BarcodeFormat;
  notes: string | null;
  categoryId: string | null;
  accentColor: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateLoyaltyCardInput = {
  title: string;
  storeName: string;
  codeValue: string;
  codeFormat?: BarcodeFormat;
  notes?: string | null;
  categoryId?: string | null;
  accentColor?: string | null;
};

export type UpdateLoyaltyCardInput = Partial<
  Omit<LoyaltyCard, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

export type Category = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
