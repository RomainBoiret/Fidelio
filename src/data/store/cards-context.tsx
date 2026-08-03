import * as React from 'react';
import { InteractionManager } from 'react-native';

import { DEMO_CARDS } from '@/data/local/demo-cards';
import * as cardsRepo from '@/data/local/cards-repository';
import type {
  CreateLoyaltyCardInput,
  LoyaltyCard,
  UpdateLoyaltyCardInput,
} from '@/domain/types';

type CardsContextValue = {
  cards: LoyaltyCard[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addCard: (input: CreateLoyaltyCardInput) => Promise<LoyaltyCard>;
  editCard: (
    id: string,
    input: UpdateLoyaltyCardInput,
  ) => Promise<LoyaltyCard | null>;
  removeCard: (id: string) => Promise<void>;
  getCardById: (id: string) => LoyaltyCard | undefined;
  toggleFavorite: (id: string) => Promise<void>;
  markOpened: (id: string) => Promise<void>;
};

const CardsContext = React.createContext<CardsContextValue | null>(null);

export function CardsProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = React.useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const seededRef = React.useRef(false);

  const refresh = React.useCallback(async () => {
    try {
      setError(null);
      await cardsRepo.ensureReady();
      let next = await cardsRepo.listCards();

      // Dev-only: seed a realistic vault so the signature ticket UI is visible.
      if (__DEV__ && !seededRef.current && next.length === 0) {
        seededRef.current = true;
        for (const demo of DEMO_CARDS) {
          await cardsRepo.createCard(demo);
        }
        next = await cardsRepo.listCards();
      }

      setCards(next);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load cards.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      void refresh();
    });
    return () => task.cancel();
  }, [refresh]);

  const addCard = React.useCallback(async (input: CreateLoyaltyCardInput) => {
    const created = await cardsRepo.createCard(input);
    setCards((prev) => [created, ...prev]);
    return created;
  }, []);

  const editCard = React.useCallback(
    async (id: string, input: UpdateLoyaltyCardInput) => {
      const updated = await cardsRepo.updateCard(id, input);
      if (updated) {
        setCards((prev) =>
          prev.map((card) => (card.id === id ? updated : card)),
        );
      }
      return updated;
    },
    [],
  );

  const removeCard = React.useCallback(async (id: string) => {
    await cardsRepo.softDeleteCard(id);
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const getCardById = React.useCallback(
    (id: string) => cards.find((card) => card.id === id),
    [cards],
  );

  const toggleFavorite = React.useCallback(
    async (id: string) => {
      const card = cards.find((c) => c.id === id);
      if (!card) return;
      await editCard(id, { isFavorite: !card.isFavorite });
    },
    [cards, editCard],
  );

  const markOpened = React.useCallback(
    async (id: string) => {
      await editCard(id, { lastOpenedAt: new Date().toISOString() });
    },
    [editCard],
  );

  const value = React.useMemo(
    () => ({
      cards,
      loading,
      error,
      refresh,
      addCard,
      editCard,
      removeCard,
      getCardById,
      toggleFavorite,
      markOpened,
    }),
    [
      cards,
      loading,
      error,
      refresh,
      addCard,
      editCard,
      removeCard,
      getCardById,
      toggleFavorite,
      markOpened,
    ],
  );

  return (
    <CardsContext.Provider value={value}>{children}</CardsContext.Provider>
  );
}

export function useCards() {
  const ctx = React.useContext(CardsContext);
  if (!ctx) {
    throw new Error('useCards must be used within CardsProvider');
  }
  return ctx;
}
