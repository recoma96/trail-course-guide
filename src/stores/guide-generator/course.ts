import {Course, COURSE_DIFFICULTY_ENUM, TrackSegment} from '@/types/track';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface State {
  course: Course;
  initSegments: (segments: TrackSegment[]) => void;
  reset: () => void;
  save: (course: Course) => void;
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
      reset: () => set({course: {
        segments: [],
        title: '',
        subTitle: '',
          description: '',
          difficulty: COURSE_DIFFICULTY_ENUM[0],
      }}),
      save: (newCourse: Course) => set((state) => ({course: newCourse})),
    }),
    {
      name: 'course',
    }
  )
);