export interface TrackPoint {
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface TrackPointWithEndpoint extends TrackPoint {
  isEndPoint: boolean;
}

interface Difficulty {
  value: number;
  code: string;
  koreanName: string;
  color: string;
}

export interface TrackSegmentDifficulty extends Difficulty {}
export interface CourseDifficulty extends Difficulty {}

export const TRACK_SEGMENT_DIFFICULTY_ENUM: TrackSegmentDifficulty[]  = [
  {value: 0, code: 'UNKNOWN', koreanName: '알수없음', color: '#777777'},
  {value: 1, code: 'EASY', koreanName: '쉬움', color: '#58b947'},
  {value: 2, code: 'NORMAL', koreanName: '보통', color: '#3c86c6'},
  {value: 3, code: 'ADVANCED', koreanName: '약간어려움', color: '#f68820'},
  {value: 4, code: 'HARD', koreanName: '어려움', color: '#bf2327'},
  {value: 5, code: 'EXPERT', koreanName: '매우어려움', color: '#010101'},
];

export const COURSE_DIFFICULTY_ENUM: CourseDifficulty[] = [
  {value: 0, code: 'UNKNOWN', koreanName: '알수없음', color: '#777777'},
  {value: 1, code: 'EASY', koreanName: '매우쉬움', color: '#d8c52b'},
  {value: 2, code: 'BEGINNER', koreanName: '쉬움~보통', color: '#58b947'},
  {value: 3, code: 'INTERMEDIATE', koreanName: '보통~약간어려움', color: '#3c86c6'},
  {value: 4, code: 'ADVANCED', koreanName: '약간어려움', color: '#f68820'},
  {value: 5, code: 'HARD', koreanName: '어려움', color: '#bf2327'},
  {value: 6, code: 'CHALLENGER', koreanName: '매우어려움', color: '#6d2c91'},
  {value: 7, code: 'EXPERT', koreanName: '산악사고주의', color: '#010101'},
]

export interface TrackSegment {
  track: TrackPoint[];
  name: string;
  description: string;
  difficulty: TrackSegmentDifficulty;
}

export interface Course {
  segments: TrackSegment[];
  title: string;
  subTitle: string;
  description: string;
  difficulty: CourseDifficulty;
}