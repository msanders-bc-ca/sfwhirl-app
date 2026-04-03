import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ResultsScreen() {
  const { score, correct, total, xpEarned } = useLocalSearchParams<{
    score: string;
    correct: string;
    total: string;
    xpEarned: string;
  }>();
  const router = useRouter();

  const scoreNum = Number(score);
  const emoji = scoreNum >= 80 ? 'star' : scoreNum >= 50 ? 'thumbs-up' : 'refresh';
  const message =
    scoreNum >= 80
      ? 'Excellent work!'
      : scoreNum >= 50
      ? 'Good effort!'
      : 'Keep practicing!';

  return (
    <View style={styles.container}>
      <FontAwesome
        name={emoji}
        size={64}
        color={scoreNum >= 80 ? '#F59E0B' : scoreNum >= 50 ? '#3B82F6' : '#6B7280'}
        style={styles.icon}
      />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.score}>{scoreNum}%</Text>
      <Text style={styles.breakdown}>
        {correct} / {total} correct
      </Text>

      <View style={styles.xpBadge}>
        <FontAwesome name="bolt" size={16} color="#F59E0B" />
        <Text style={styles.xpText}>+{xpEarned} XP earned</Text>
      </View>

      <Pressable style={styles.btn} onPress={() => router.replace('/')}>
        <Text style={styles.btnText}>Back to Topics</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => router.back()}>
        <Text style={[styles.btnText, styles.btnTextSecondary]}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', padding: 24 },
  icon: { marginBottom: 16 },
  message: { color: '#94A3B8', fontSize: 18, marginBottom: 8 },
  score: { color: '#F9FAFB', fontSize: 72, fontWeight: '800', lineHeight: 80 },
  breakdown: { color: '#6B7280', fontSize: 16, marginBottom: 24 },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1E293B', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10,
    marginBottom: 40,
  },
  xpText: { color: '#F59E0B', fontWeight: '700', fontSize: 16 },
  btn: {
    width: '100%', backgroundColor: '#3B82F6',
    borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  btnSecondary: { backgroundColor: '#1E293B' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnTextSecondary: { color: '#94A3B8' },
});
