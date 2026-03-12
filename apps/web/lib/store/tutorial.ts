import { create } from "zustand";
import { persist } from "zustand/middleware";

type TutorialStore = {
  completed: boolean;
  step: number;
  setStep: (step: number) => void;
  complete: () => void;
  restart: () => void;
};

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set) => ({
      completed: false,
      step: 0,
      setStep: (step) => set({ step }),
      complete: () => set({ completed: true, step: 0 }),
      restart: () => set({ completed: false, step: 0 }),
    }),
    { name: "ncs-tutorial" },
  ),
);
