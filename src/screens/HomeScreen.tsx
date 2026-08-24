import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { DuckMascot } from '../components/DuckMascot';
import { BigButton } from '../components/BigButton';
import { NatureBackdrop } from '../components/NatureBackdrop';
import { colors, spacing, typography } from '../theme/theme';
import { loadStreak, StreakInfo } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [streak, setStreak] = useState<StreakInfo | null>(null);

  useEffect(() => {
    loadStreak().then(setStreak);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NatureBackdrop />

      <Pressable onPress={() => navigation.navigate('Dashboard')} style={styles.settingsButton} hitSlop={12}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </Pressable>

      <View style={styles.content}>
        <DuckMascot size={180} />
        <Text style={styles.title}>Mini Poliglota</Text>
        <Text style={styles.subtitle}>Vamos aprender palavras novas hoje?</Text>

        {streak && streak.currentStreak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak.currentStreak} dia(s) seguidos</Text>
          </View>
        )}

        <BigButton label="▶️  Começar" onPress={() => navigation.navigate('Session')} style={{ marginTop: spacing.xl, width: '100%' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.parchment },
  settingsButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 1,
    padding: spacing.xs,
  },
  settingsIcon: { fontSize: 28 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.display, color: colors.ink, marginTop: spacing.md },
  subtitle: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm, textAlign: 'center' },
  streakBadge: {
    marginTop: spacing.lg,
    backgroundColor: colors.cardAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  streakText: { ...typography.caption, color: colors.ink },
});
