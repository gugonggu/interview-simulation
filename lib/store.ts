import { create } from "zustand";

export interface State {
  category: string;
  questionType: string[];
  difficulty: string;
}

export interface Actions {
  setCategory: (category: string) => void;
  addQuestionType: (questionType: string) => void;
  removeQuestionType: (questionType: string) => void;
  setDifficulty: (difficulty: string) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<State & Actions>((set) => ({
  category: "",
  questionType: [],
  difficulty: "",
  setCategory: (category: string) => set({ category }),
  addQuestionType: (questionType: string) =>
    set((state) => ({
      questionType: state.questionType.includes(questionType)
        ? state.questionType
        : [...state.questionType, questionType],
    })),
  removeQuestionType: (questionType: string) =>
    set((state) => ({
      questionType: state.questionType.filter((q) => q !== questionType),
    })),

  setDifficulty: (difficulty: string) => set({ difficulty }),
  resetSettings: () => set({ category: "", questionType: [], difficulty: "" }),
}));
