import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { SoftCard } from '@/components/ui/soft-card';
import { TextField } from '@/components/ui/text-field';
import { WaveEdge } from '@/components/ui/wave-edge';
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
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
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
      setError('Identifiant de carte manquant.');
      return;
    }

    const nextTitle = title.trim() || 'Carte scannée';
    const nextStore = storeName.trim() || 'Magasin';

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
        throw new Error('Impossible de trouver cette carte pour l’enregistrer.');
      }

      setTitle(updated.title);
      setStoreName(updated.storeName);
      setNotes(updated.notes ?? '');
      setSavedFlash(true);

      // Always land on the cards list (not Scan via history back).
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Enregistrement impossible.';
      setError(message);
      notify('Enregistrement échoué', message);
    } finally {
      setSaving(false);
    }
  }, [editCard, id, notes, router, storeName, title]);

  function onDelete() {
    if (!id) return;

    const confirmed =
      Platform.OS === 'web'
        ? window.confirm('Supprimer cette carte ? Tu pourras la rescanner plus tard.')
        : null;

    if (Platform.OS === 'web') {
      if (!confirmed) return;
      void (async () => {
        await removeCard(id);
        router.replace('/');
      })();
      return;
    }

    Alert.alert('Supprimer cette carte ?', 'Tu pourras la rescanner plus tard.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
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
          Carte introuvable
        </Text>
        <Button label="Retour" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen scroll padded={false} edges={['left', 'right']}>
      <View style={{ backgroundColor: colors.accentDeep }}>
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.accentDeep,
              paddingTop: insets.top + Spacing.md,
            },
          ]}
        >
          <View style={[styles.glow, { backgroundColor: card.accentColor ?? colors.accent }]} />
          <View style={styles.topBar}>
            <IconButton name="arrow-left" tone="secondary" onPress={() => router.back()} />
            <View style={{ width: 48 }} />
          </View>

          <Animated.View
            entering={
              reduceMotion
                ? undefined
                : FadeInUp.duration(560).easing(Easing.out(Easing.cubic))
            }
            style={styles.heroCopy}
          >
            <Text style={[styles.heroEyebrow, { fontFamily: Fonts.bodyMedium }]}>
              {formatBarcodeLabel(card.codeFormat)}
            </Text>
            <Text style={[styles.heroTitle, { fontFamily: Fonts.displayBold }]}>
              {title || card.title}
            </Text>
            <Text style={[styles.heroStore, { fontFamily: Fonts.body }]}>
              {storeName || card.storeName}
            </Text>
          </Animated.View>
        </View>
        <WaveEdge fill={colors.background} />
      </View>

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <SoftCard style={styles.codePanel}>
          <Text
            style={[styles.codeLabel, { color: colors.textMuted, fontFamily: Fonts.bodyMedium }]}
          >
            Code en caisse
          </Text>
          <Text
            selectable
            style={[styles.codeValue, { color: colors.text, fontFamily: Fonts.displayBold }]}
          >
            {card.codeValue}
          </Text>
          <Button
            label="Montrer en caisse"
            onPress={() => router.push(`/card/${card.id}/present`)}
            style={{ marginTop: Spacing.md }}
          />
        </SoftCard>

        <View style={styles.form}>
          <TextField label="Nom" value={title} onChangeText={setTitle} />
          <TextField label="Magasin" value={storeName} onChangeText={setStoreName} />
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
            label={
              saving ? 'Enregistrement…' : savedFlash ? 'Enregistré ✓' : 'Enregistrer'
            }
            onPress={() => {
              void onSave();
            }}
            disabled={saving || savedFlash}
          />
          <Button label="Supprimer" variant="ghost" onPress={onDelete} disabled={saving} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -60,
    right: -50,
    opacity: 0.35,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroCopy: {
    gap: 6,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  heroStore: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 16,
  },
  sheet: {
    marginTop: -6,
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
    fontSize: 28,
    letterSpacing: 1,
  },
  form: {
    gap: Spacing.lg,
  },
  actions: {
    gap: Spacing.md,
    zIndex: 2,
  },
});
