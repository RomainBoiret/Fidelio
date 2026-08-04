import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { WalletAtmosphere } from '@/components/brand/wallet-atmosphere';
import { Button } from '@/components/ui/button';
import { GalleryHeader } from '@/components/ui/gallery-header';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { SoftCard } from '@/components/ui/soft-card';
import { TextField } from '@/components/ui/text-field';
import { useCards } from '@/data/store/cards-context';
import { formatBarcodeLabel } from '@/domain/card';
import { collectionLabel, catalogueIndex } from '@/domain/gallery';
import { Fonts, FontWeight, Spacing } from '@/constants/theme';
import { useSafeBack } from '@/hooks/use-safe-back';
import { useTheme } from '@/hooks/use-theme';

function paramId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function notify(title: string, message?: string) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export default function CardDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = paramId(params.id);
  const colors = useTheme();
  const router = useRouter();
  const goBack = useSafeBack('/');
  const { cards, getCardById, editCard, removeCard } = useCards();
  const card = id ? getCardById(id) : undefined;
  const catalogueNo = card ? catalogueIndex(cards, card.id) : 1;

  const [title, setTitle] = React.useState(card?.title ?? '');
  const [storeName, setStoreName] = React.useState(card?.storeName ?? '');
  const [notes, setNotes] = React.useState(card?.notes ?? '');
  const [saving, setSaving] = React.useState(false);
  const [savedFlash, setSavedFlash] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (card) {
      setTitle(card.title);
      setStoreName(card.storeName);
      setNotes(card.notes ?? '');
    }
  }, [card?.id, card?.updatedAt]);

  const onSave = React.useCallback(async () => {
    if (!id) {
      setError('Missing card id.');
      return;
    }

    const nextTitle = title.trim() || 'Loyalty card';
    const nextStore = storeName.trim() || 'Store';

    setSaving(true);
    setError(null);
    setSavedFlash(false);

    try {
      const updated = await editCard(id, {
        title: nextTitle,
        storeName: nextStore,
        notes: notes.trim() || null,
      });

      if (!updated) {
        throw new Error('Could not find this card to save it.');
      }

      setTitle(updated.title);
      setStoreName(updated.storeName);
      setNotes(updated.notes ?? '');
      setSavedFlash(true);
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not save.';
      setError(message);
      notify('Save failed', message);
    } finally {
      setSaving(false);
    }
  }, [editCard, id, notes, router, storeName, title]);

  function onDelete() {
    if (!id) return;

    const confirmed =
      Platform.OS === 'web'
        ? window.confirm('Delete this card? You can scan it again later.')
        : null;

    if (Platform.OS === 'web') {
      if (!confirmed) return;
      void (async () => {
        await removeCard(id);
        router.replace('/');
      })();
      return;
    }

    Alert.alert('Delete this card?', 'You can scan it again later.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await removeCard(id);
            router.replace('/');
          })();
        },
      },
    ]);
  }

  if (!card) {
    return (
      <View style={styles.root}>
        <WalletAtmosphere intensity="soft" />
        <Screen transparent>
          <Text style={{ color: colors.ink, fontFamily: Fonts.displayBold, fontSize: 22 }}>
            Card not found
          </Text>
          <Button label="Back" variant="secondary" onPress={goBack} />
        </Screen>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <WalletAtmosphere intensity="rich" />
      <Screen scroll padded={false} edges={['left', 'right']} transparent>
        <GalleryHeader
          title={title || card.title}
          subtitle={`${storeName || card.storeName} · ${formatBarcodeLabel(card.codeFormat)} · ${collectionLabel(catalogueNo)}`}
          pieceCount={cards.length}
          right={<IconButton name="close" tone="secondary" onPress={goBack} />}
        />

        <View style={styles.sheet}>
          <SoftCard style={styles.codePanel}>
            <Text
              style={[
                styles.codeLabel,
                {
                  color: colors.textMuted,
                  fontFamily: Fonts.bodyMedium,
                  fontWeight: FontWeight.medium,
                },
              ]}
            >
              Checkout code
            </Text>
            <Text
              selectable
              style={[
                styles.codeValue,
                {
                  color: colors.ink,
                  fontFamily: Fonts.displayBold,
                  fontWeight: FontWeight.heavy,
                },
              ]}
            >
              {card.codeValue}
            </Text>
            <Button
              label="Present at checkout"
              onPress={() => router.push(`/card/${card.id}/present`)}
              style={{ marginTop: Spacing.md }}
            />
          </SoftCard>

          <View style={styles.form}>
            <TextField label="Name" value={title} onChangeText={setTitle} />
            <TextField label="Store" value={storeName} onChangeText={setStoreName} />
            <TextField
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: 16 }}
            />
          </View>

          {error ? (
            <Text style={{ color: colors.danger, fontFamily: Fonts.body }}>{error}</Text>
          ) : null}

          <View style={styles.actions}>
            <Button
              label={saving ? 'Saving…' : savedFlash ? 'Saved ✓' : 'Save'}
              onPress={() => {
                void onSave();
              }}
              disabled={saving || savedFlash}
            />
            <Button label="Delete" variant="ghost" onPress={onDelete} disabled={saving} />
          </View>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
  sheet: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
  },
  codePanel: {
    gap: Spacing.sm,
  },
  codeLabel: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  codeValue: {
    fontSize: 26,
    letterSpacing: 0.8,
  },
  form: {
    gap: Spacing.lg,
  },
  actions: {
    gap: Spacing.md,
  },
});
