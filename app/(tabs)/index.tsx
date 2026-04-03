import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SEED_TOPICS, CATEGORY_COLORS, CATEGORY_LABELS, DIFFICULTY_XP } from '@/constants/topics';

export default function TopicsScreen() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');

  const filtered = SEED_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      CATEGORY_LABELS[t.category].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Topic</Text>
      <TextInput
        style={styles.search}
        placeholder="Search topics..."
        placeholderTextColor="#6B7280"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const color = CATEGORY_COLORS[item.category];
          const xp = DIFFICULTY_XP[item.difficulty];
          return (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() =>
                router.push({
                  pathname: '/game',
                  params: { topicTitle: item.title },
                })
              }
            >
              <View style={[styles.categoryBadge, { backgroundColor: color + '22' }]}>
                <Text style={[styles.categoryText, { color }]}>
                  {CATEGORY_LABELS[item.category]}
                </Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.footer}>
                <Text style={styles.difficulty}>{item.difficulty.toUpperCase()}</Text>
                <Text style={styles.xp}>+{xp} XP / question</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  heading: { color: '#F9FAFB', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  search: {
    backgroundColor: '#1E293B',
    color: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: { opacity: 0.75 },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  categoryText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  title: { color: '#F9FAFB', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  description: { color: '#94A3B8', fontSize: 13, lineHeight: 18, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  difficulty: { color: '#6B7280', fontSize: 11, fontWeight: '600' },
  xp: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },
});
