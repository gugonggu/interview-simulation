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

interface ChatFeedbackState {
  text: string;
  role: string;
  time: Date | null;
  isFeedbackable: boolean | null;
  questionIntend?: string;
  answerTips?: string[];
  wells?: string[];
  improves?: string[];
  improvement?: string;
}

export interface ChatFeedbackActions {
  setChatFeedback: (
    text: string,
    role: string,
    time: Date,
    isFeedbackable: boolean,
    questionIntend?: string,
    answerTips?: string[],
    wells?: string[],
    improves?: string[],
    improvement?: string
  ) => void;
  resetChatFeedback: () => void;
}

export const useChatFeedbackStore = create<
  ChatFeedbackState & ChatFeedbackActions
>((set) => ({
  text: "",
  role: "",
  time: null,
  isFeedbackable: null,
  questionIntend: "",
  answerTips: [],
  wells: [],
  improves: [],
  improvement: "",
  setChatFeedback: (
    text: string,
    role: string,
    time: Date,
    isFeedbackable: boolean,
    questionIntend?: string,
    answerTips?: string[],
    wells?: string[],
    improves?: string[],
    improvement?: string
  ) =>
    set({
      text,
      role,
      time,
      isFeedbackable,
      questionIntend,
      answerTips,
      wells,
      improves,
      improvement,
    }),
  resetChatFeedback: () =>
    set({
      text: "",
      role: "",
      time: null,
      isFeedbackable: null,
      questionIntend: "",
      answerTips: [],
      wells: [],
      improves: [],
      improvement: "",
    }),
}));
