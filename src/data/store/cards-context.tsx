import * as React from 'react';
import { InteractionManager } from 'react-native';

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
};

const CardsContext = React.createContext<CardsContextValue | null>(null);

export function CardsProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = React.useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setError(null);
      await cardsRepo.ensureReady();
      const next = await cardsRepo.listCards();
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
    // Let the first frame paint before touching SQLite.
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
    }),
    [cards, loading, error, refresh, addCard, editCard, removeCard, getCardById],
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
