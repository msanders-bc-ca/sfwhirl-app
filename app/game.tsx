import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SEED_TOPICS } from '@/constants/topics';
import { generateQuestions } from '@/lib/claude';
import { useGameStore } from '@/store/gameStore';
import { Question, Topic } from '@/types';

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function GameScreen() {
  const { topicTitle } = useLocalSearchParams<{ topicTitle: string }>();
  const router = useRouter();

  const { activeGame, startGame, answerQuestion, advanceQuestion, endGame, isLoadingQuestions, setLoadingQuestions } =
    useGameStore();

  const [chosenIndex, setChosenIndex] = React.useState<number | null>(null);
  const [answerState, setAnswerState] = React.useState<AnswerState>('unanswered');
  const [showExplanation, setShowExplanation] = React.useState(false);

  const topic: Topic | undefined = React.useMemo(
    () =>
      SEED_TOPICS.find((t) => t.title === topicTitle) as Topic | undefined,
    [topicTitle]
  );

  // Load questions on mount
  React.useEffect(() => {
    if (!topic || activeGame) return;
    (async () => {
      setLoadingQuestions(true);
      try {
        const questions = await generateQuestions({ topic, count: 5 });
        // Assign temp IDs for client-side use
        const withIds = questions.map((q, i) => ({ ...q, id: String(i) }));
        startGame(topic, withIds);
      } catch (e) {
        Alert.alert('Error', 'Could not load questions. Check your API key.');
        router.back();
      } finally {
        setLoadingQuestions(false);
      }
    })();
  }, [topic]);

  if (isLoadingQuestions || !activeGame) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Generating questions with AI...</Text>
      </View>
    );
  }

  const currentQ: Question = activeGame.questions[activeGame.currentIndex];
  const isLastQuestion = activeGame.currentIndex === activeGame.questions.length - 1;
  const progress = (activeGame.currentIndex + 1) / activeGame.questions.length;

  const handleChoose = (index: number) => {
    if (answerState !== 'unanswered') return;
    setChosenIndex(index);
    const correct = index === currentQ.correct_index;
    setAnswerState(correct ? 'correct' : 'incorrect');
    setShowExplanation(true);
    answerQuestion(index);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const result = endGame();
      if (result) {
        router.replace({
          pathname: '/results',
          params: {
            score: result.score,
            correct: result.correct,
            total: result.total,
            xpEarned: result.xpEarned,
          },
        });
      }
    } else {
      // Reset local UI state first, then advance the store index.
      setChosenIndex(null);
      setAnswerState('unanswered');
      setShowExplanation(false);
      advanceQuestion();
    }
  };

  const optionStyle = (index: number) => {
    if (answerState === 'unanswered') return styles.option;
    if (index === currentQ.correct_index) return [styles.option, styles.optionCorrect];
    if (index === chosenIndex) return [styles.option, styles.optionIncorrect];
    return [styles.option, styles.optionDimmed];
  };

  const optionTextStyle = (index: number) => {
    if (answerState === 'unanswered') return styles.optionText;
    if (index === currentQ.correct_index) return [styles.optionText, styles.optionTextCorrect];
    if (index === chosenIndex) return [styles.optionText, styles.optionTextIncorrect];
    return [styles.optionText, styles.optionTextDimmed];
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.topRow}>
        <Text style={styles.topicLabel}>{activeGame.topic.title}</Text>
        <Text style={styles.counter}>
          {activeGame.currentIndex + 1} / {activeGame.questions.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question_text}</Text>
      </View>

      {/* Options */}
      {currentQ.options.map((option, i) => (
        <Pressable key={i} style={optionStyle(i)} onPress={() => handleChoose(i)}>
          <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}.</Text>
          <Text style={optionTextStyle(i)}>{option}</Text>
        </Pressable>
      ))}

      {/* Explanation */}
      {showExplanation && (
        <View
          style={[
            styles.explanation,
            answerState === 'correct' ? styles.explanationCorrect : styles.explanationIncorrect,
          ]}
        >
          <Text style={styles.explanationHeader}>
            {answerState === 'correct' ? 'Correct!' : 'Not quite.'}
          </Text>
          <Text style={styles.explanationText}>{currentQ.explanation}</Text>
        </View>
      )}

      {/* Next / Finish button */}
      {showExplanation && (
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
  loadingText: { color: '#94A3B8', marginTop: 16, fontSize: 15 },
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 16, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  topicLabel: { color: '#3B82F6', fontSize: 13, fontWeight: '600', flex: 1 },
  counter: { color: '#6B7280', fontSize: 13 },
  progressBar: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, marginBottom: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 3 },
  questionCard: {
    backgroundColor: '#1E293B', borderRadius: 14, padding: 20, marginBottom: 20,
  },
  questionText: { color: '#F9FAFB', fontSize: 17, fontWeight: '600', lineHeight: 26 },
  option: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#1E293B', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#334155',
  },
  optionCorrect: { backgroundColor: '#064E3B', borderColor: '#10B981' },
  optionIncorrect: { backgroundColor: '#450A0A', borderColor: '#EF4444' },
  optionDimmed: { opacity: 0.4 },
  optionLetter: { color: '#6B7280', fontWeight: '700', fontSize: 15, marginRight: 10, minWidth: 20 },
  optionText: { color: '#F9FAFB', fontSize: 15, flex: 1, lineHeight: 22 },
  optionTextCorrect: { color: '#10B981', fontWeight: '600' },
  optionTextIncorrect: { color: '#EF4444' },
  optionTextDimmed: { color: '#6B7280' },
  explanation: { borderRadius: 12, padding: 16, marginTop: 6, marginBottom: 16 },
  explanationCorrect: { backgroundColor: '#064E3B' },
  explanationIncorrect: { backgroundColor: '#1C1917' },
  explanationHeader: { color: '#F9FAFB', fontWeight: '700', fontSize: 15, marginBottom: 6 },
  explanationText: { color: '#CBD5E1', fontSize: 14, lineHeight: 21 },
  nextButton: {
    backgroundColor: '#3B82F6', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
