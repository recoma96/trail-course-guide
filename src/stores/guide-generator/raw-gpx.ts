"use client"

import { create } from "zustand";
import {TrackPoint} from '@/types/track';

interface State {
  segment: TrackPoint[];
  init: (parsedGpxSegment: TrackPoint[]) => void;
}

export const useRawGpxSegment = create<State>((set) => ({
  segment: [],
  init: (parsedGpxSegment: TrackPoint[]) => set({segment: parsedGpxSegment})
}));
