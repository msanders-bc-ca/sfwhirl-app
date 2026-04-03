import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LEVEL_TITLES, getXPForNextLevel } from '@/constants/levels';
import { useGameStore } from '@/store/gameStore';

export default function ProfileScreen() {
  const profile = useGameStore((s) => s.profile);

  // Mock profile while auth is not yet wired up
  const displayProfile = profile ?? {
    display_name: 'Guest',
    total_xp: 0,
    level: 1,
    streak_days: 0,
    badges: [],
  };

  const nextLevelXP = getXPForNextLevel(displayProfile.level);
  const progress = Math.min(displayProfile.total_xp / nextLevelXP, 1);
  const title = LEVEL_TITLES[displayProfile.level] ?? 'Med Device Pro';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayProfile.display_name[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{displayProfile.display_name}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Level" value={String(displayProfile.level)} />
        <Stat label="Total XP" value={displayProfile.total_xp.toLocaleString()} />
        <Stat label="Streak" value={`${displayProfile.streak_days}d`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Progress to Level {displayProfile.level + 1}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {displayProfile.total_xp} / {nextLevelXP} XP
        </Text>
      </View>

      {displayProfile.badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Badges</Text>
          <View style={styles.badgesRow}>
            {displayProfile.badges.map((b) => (
              <View key={b} style={styles.badge}>
                <Text style={styles.badgeText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { alignItems: 'center', paddingTop: 36, paddingBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  name: { color: '#F9FAFB', fontSize: 22, fontWeight: '700' },
  title: { color: '#3B82F6', fontSize: 13, fontWeight: '600', marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 20,
    marginBottom: 20,
  },
  stat: { alignItems: 'center' },
  statValue: { color: '#F9FAFB', fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 24 },
  sectionLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 10 },
  progressBar: { height: 10, backgroundColor: '#1E293B', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 5 },
  progressText: { color: '#6B7280', fontSize: 12, marginTop: 6, textAlign: 'right' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    backgroundColor: '#1E293B', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  badgeText: { color: '#F59E0B', fontSize: 13, fontWeight: '600' },
});
