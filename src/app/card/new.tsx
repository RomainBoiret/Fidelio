import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CurveHero } from '@/components/ui/curve-hero';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useCards } from '@/data/store/cards-context';
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
      Alert.alert('Code manquant', 'Ajoute au moins le code de la carte.');
      return;
    }

    setSaving(true);
    try {
      const card = await addCard({
        title: title.trim() || storeName.trim() || 'Ma carte',
        storeName: storeName.trim() || 'Magasin',
        codeValue: codeValue.trim(),
        notes: notes.trim() || null,
        codeFormat: 'unknown',
      });
      router.replace(`/card/${card.id}`);
    } catch (err) {
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Impossible d’enregistrer la carte.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll padded={false} edges={['left', 'right']}>
      <CurveHero
        eyebrow="Nouvelle carte"
        title="Ajout manuel"
        subtitle="Utile quand le scan n’est pas pratique, ou pour coller un code."
        height={240}
        right={<IconButton name="close" tone="secondary" onPress={() => router.back()} />}
      />

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={styles.form}>
          <TextField
            label="Nom"
            placeholder="Carte fidélité"
            value={title}
            onChangeText={setTitle}
          />
          <TextField
            label="Magasin"
            placeholder="Auchan, Starbucks…"
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
            placeholder="Optionnel"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: 16 }}
          />
        </View>

        <View style={styles.actions}>
          <Button
            label={saving ? 'Enregistrement…' : 'Enregistrer'}
            onPress={() => void onSave()}
            disabled={saving}
          />
          <Button label="Annuler" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginTop: -8,
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
