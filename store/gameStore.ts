import { create } from 'zustand';
import { Question, Topic, UserProfile } from '@/types';
import { getLevelFromXP } from '@/constants/levels';

interface ActiveGame {
  topic: Topic;
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];  // index of chosen answer per question
  startedAt: Date;
}

interface GameStore {
  // User
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  addXP: (amount: number) => void;

  // Active game
  activeGame: ActiveGame | null;
  startGame: (topic: Topic, questions: Question[]) => void;
  answerQuestion: (chosenIndex: number) => void;
  advanceQuestion: () => void;
  endGame: () => { score: number; correct: number; total: number; xpEarned: number } | null;

  // UI state
  isLoadingQuestions: boolean;
  setLoadingQuestions: (val: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  profile: null,

  setProfile: (profile) => set({ profile }),

  addXP: (amount) =>
    set((state) => {
      if (!state.profile) return state;
      const newXP = state.profile.total_xp + amount;
      return {
        profile: {
          ...state.profile,
          total_xp: newXP,
          level: getLevelFromXP(newXP),
        },
      };
    }),

  activeGame: null,

  startGame: (topic, questions) =>
    set({
      activeGame: {
        topic,
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        startedAt: new Date(),
      },
    }),

  answerQuestion: (chosenIndex) =>
    set((state) => {
      if (!state.activeGame) return state;
      const answers = [...state.activeGame.answers];
      answers[state.activeGame.currentIndex] = chosenIndex;
      // Only record the answer — do NOT advance currentIndex here.
      // Advancing happens in advanceQuestion, called when the user taps Next.
      return { activeGame: { ...state.activeGame, answers } };
    }),

  advanceQuestion: () =>
    set((state) => {
      if (!state.activeGame) return state;
      return {
        activeGame: {
          ...state.activeGame,
          currentIndex: Math.min(
            state.activeGame.currentIndex + 1,
            state.activeGame.questions.length - 1
          ),
        },
      };
    }),

  endGame: () => {
    const { activeGame } = get();
    if (!activeGame) return null;

    const correct = activeGame.answers.reduce<number>((acc, answer, i) => {
      return answer === activeGame.questions[i].correct_index ? acc + 1 : acc;
    }, 0);

    const total = activeGame.questions.length;
    const score = Math.round((correct / total) * 100);
    const xpEarned = correct * 15;

    set({ activeGame: null });
    return { score, correct, total, xpEarned };
  },

  isLoadingQuestions: false,
  setLoadingQuestions: (val) => set({ isLoadingQuestions: val }),
}));
