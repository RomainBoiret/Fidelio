import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CurveHero } from '@/components/ui/curve-hero';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useCards } from '@/data/store/cards-context';
import { guessBarcodeFormat } from '@/domain/card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function NewCardScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { addCard } = useCards();
  const [title, setTitle] = React.useState('');
  const [storeName, setStoreName] = React.useState('');
  const [codeValue, setCodeValue] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  async function onSave() {
    if (!codeValue.trim()) {
      Alert.alert('Missing code', 'Add at least the card code.');
      return;
    }

    setSaving(true);
    try {
      const trimmedCode = codeValue.trim();
      const card = await addCard({
        title: title.trim() || storeName.trim() || 'My card',
        storeName: storeName.trim() || 'Store',
        codeValue: trimmedCode,
        notes: notes.trim() || null,
        codeFormat: guessBarcodeFormat(trimmedCode),
      });
      router.replace(`/card/${card.id}`);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Could not save the card.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow="New card"
        title="Manual entry"
        subtitle="Handy when scanning is awkward, or when you want to paste a code."
        height={170}
        right={<IconButton name="close" tone="secondary" onPress={() => router.back()} />}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={styles.form}>
          <TextField
            label="Name"
            placeholder="Loyalty card"
            value={title}
            onChangeText={setTitle}
          />
          <TextField
            label="Store"
            placeholder="Walmart, Starbucks…"
            value={storeName}
            onChangeText={setStoreName}
          />
          <TextField
            label="Code"
            placeholder="1234567890123"
            value={codeValue}
            onChangeText={setCodeValue}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextField
            label="Notes"
            placeholder="Optional"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: 16 }}
          />
        </View>

        <View style={styles.actions}>
          <Button
            label={saving ? 'Saving…' : 'Save'}
            onPress={() => void onSave()}
            disabled={saving}
          />
          <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  form: {
    gap: Spacing.lg,
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});
