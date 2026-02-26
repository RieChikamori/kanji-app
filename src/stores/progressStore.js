import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProgressStore = create(
  persist(
    (set, get) => ({
      kanjiProgress: {},

      recordPractice: (character, type, correct) => {
        set((state) => {
          const prev = state.kanjiProgress[character] || {
            writingScore: 0,
            readingScore: 0,
            meaningScore: 0,
            lastPracticed: null,
          };
          const key = `${type}Score`;
          return {
            kanjiProgress: {
              ...state.kanjiProgress,
              [character]: {
                ...prev,
                [key]: correct
                  ? Math.min(prev[key] + 1, 5)
                  : Math.max(prev[key] - 1, 0),
                lastPracticed: new Date().toISOString().split('T')[0],
              },
            },
          };
        });
      },

      getMastery: (character) => {
        const p = get().kanjiProgress[character];
        if (!p) return 0;
        return Math.round(((p.writingScore + p.readingScore + p.meaningScore) / 15) * 100);
      },

      getScore: (character, type) => {
        const p = get().kanjiProgress[character];
        if (!p) return 0;
        return p[`${type}Score`] || 0;
      },

      getTotalMastery: () => {
        const progress = get().kanjiProgress;
        const chars = Object.keys(progress);
        if (chars.length === 0) return 0;
        const total = chars.reduce((sum, c) => sum + get().getMastery(c), 0);
        return Math.round(total / 200);
      },

      getPracticedCount: () => {
        return Object.keys(get().kanjiProgress).length;
      },

      resetProgress: () => {
        set({ kanjiProgress: {} });
      },
    }),
    { name: 'kanji-progress' }
  )
);
