import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CurveHero } from '@/components/ui/curve-hero';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { SoftCard } from '@/components/ui/soft-card';
import { TextField } from '@/components/ui/text-field';
import { useCards } from '@/data/store/cards-context';
import { formatBarcodeLabel } from '@/domain/card';
import { Fonts, Spacing } from '@/constants/theme';
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
  const { getCardById, editCard, removeCard } = useCards();
  const card = id ? getCardById(id) : undefined;

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

    const nextTitle = title.trim() || 'Scanned card';
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
      <Screen>
        <Text style={{ color: colors.text, fontFamily: Fonts.display }}>
          Card not found
        </Text>
        <Button label="Back" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen scroll padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow={formatBarcodeLabel(card.codeFormat)}
        title={title || card.title}
        subtitle={storeName || card.storeName}
        height={180}
        right={<IconButton name="close" tone="secondary" onPress={() => router.back()} />}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <SoftCard style={styles.codePanel}>
          <Text
            style={[styles.codeLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}
          >
            Checkout code
          </Text>
          <Text
            selectable
            style={[styles.codeValue, { color: colors.text, fontFamily: Fonts.displayBold }]}
          >
            {card.codeValue}
          </Text>
          <Button
            label="Show at checkout"
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
  );
}

const styles = StyleSheet.create({
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
    letterSpacing: 0.4,
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
