import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Placeholder leaderboard data — replace with Supabase query
const MOCK_LEADERS = [
  { rank: 1, name: 'DrDevice', xp: 4850, level: 8 },
  { rank: 2, name: 'FDA_Ninja', xp: 3200, level: 7 },
  { rank: 3, name: 'ClinTrialPro', xp: 2700, level: 6 },
  { rank: 4, name: 'ReimbQueen', xp: 1900, level: 5 },
  { rank: 5, name: 'PMAHunter', xp: 1450, level: 4 },
];

const RANK_COLORS = ['#F59E0B', '#94A3B8', '#D97706'];

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Leaderboard</Text>
      <FlatList
        data={MOCK_LEADERS}
        keyExtractor={(item) => String(item.rank)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.rank, { color: RANK_COLORS[item.rank - 1] ?? '#6B7280' }]}>
              {item.rank <= 3 ? '' : `#${item.rank}`}
              {item.rank === 1 && <FontAwesome name="trophy" size={18} color="#F59E0B" />}
              {item.rank === 2 && <FontAwesome name="trophy" size={16} color="#94A3B8" />}
              {item.rank === 3 && <FontAwesome name="trophy" size={14} color="#D97706" />}
            </Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.level}>Level {item.level}</Text>
            </View>
            <Text style={styles.xp}>{item.xp.toLocaleString()} XP</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  heading: { color: '#F9FAFB', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rank: { width: 36, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  info: { flex: 1, marginLeft: 12 },
  name: { color: '#F9FAFB', fontSize: 16, fontWeight: '600' },
  level: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  xp: { color: '#F59E0B', fontWeight: '700', fontSize: 14 },
});
