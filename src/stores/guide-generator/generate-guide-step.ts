import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {UPLOAD_GPX_PAGE} from '@/types/generate-step';

interface State {
  stepCode: string;
  setStepCode: (stepCode: string) => void;
}

export const useGenerateGuideStep = create<State>()(
  persist(
    (set) => ({
      stepCode: UPLOAD_GPX_PAGE,
      setStepCode: (stepCode: string) => set({stepCode}),
    }),
    {
      name: 'generate-guide-step',
    }
  )
);