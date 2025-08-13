import {Course, COURSE_DIFFICULTY_ENUM, TrackSegment} from '@/types/track';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface State {
  course: Course;
  initSegments: (segments: TrackSegment[]) => void;
}

export const useCourse = create<State>()(
  persist(
    (set) => ({
      course: {
        segments: [],
        title: '',
        subTitle: '',
        description: '',
        difficulty: COURSE_DIFFICULTY_ENUM[0],
      },
      initSegments: (segments) => set((state) => ({course: {...state.course, segments}})),
    }),
    {
      name: 'course',
    }
  )
);