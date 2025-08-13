"use client"

import { create } from "zustand";
import {TrackPoint, TrackPointWithEndpoint} from '@/types/track';
import {persist} from 'zustand/middleware';

interface State {
  segment: TrackPointWithEndpoint[];
  init: (parsedGpxSegment: TrackPoint[]) => void;
  update: (index: number, point: TrackPointWithEndpoint) => void;
}

export const useRawGpxSegment = create<State>()(
  persist(
    (set) => ({
      segment: [],
      init: (parsedGpxSegment: TrackPoint[]) =>  set(() => ({
        segment: parsedGpxSegment.map((point) => ({
          ...point,
          isEndPoint: false
        }))
      })),
      update: (index: number, point: TrackPointWithEndpoint) => set((state) => {
        state.segment[index] = point;
        return {
          segment: [...state.segment]
        }
      }),
    }),
    {
      name: 'track-segment',
    }
  )
);