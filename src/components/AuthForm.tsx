import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { BigButton } from './BigButton';
import { colors, radii, spacing, typography } from '../theme/theme';

interface Props {
  onSignedIn: () => void;
}

export function AuthForm({ onSignedIn }: Props) {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email || !password) {
      setError('Preencha email e senha.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: authError } =
      mode === 'signIn'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    onSignedIn();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{mode === 'signIn' ? 'Entrar' : 'Criar conta'}</Text>
      <Text style={styles.subtitle}>Acompanhe o progresso do seu filho de qualquer lugar.</Text>

      <TextInput
        style={styles.input}
        placeholder="email@exemplo.com"
        placeholderTextColor={colors.inkSoft}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.inkSoft}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator color={colors.plum} style={{ marginTop: spacing.md }} />
      ) : (
        <BigButton
          label={mode === 'signIn' ? 'Entrar' : 'Criar conta'}
          onPress={submit}
          color={colors.plum}
          style={{ marginTop: spacing.md, width: '100%' }}
        />
      )}

      <Text style={styles.toggle} onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
        {mode === 'signIn' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: '100%',
  },
  title: { ...typography.title, color: colors.ink, textAlign: 'center' },
  subtitle: { ...typography.caption, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.md },
  input: {
    borderWidth: 2,
    borderColor: colors.pond,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    fontSize: 16,
    color: colors.ink,
  },
  error: { color: colors.warn, textAlign: 'center', marginTop: spacing.xs, ...typography.caption },
  toggle: { color: colors.plum, textAlign: 'center', marginTop: spacing.md, ...typography.caption },
});
