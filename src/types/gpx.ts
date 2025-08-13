export interface GPXPoint {
  lat: number;
  lon: number;
  ele: number;
  time?: string;
}

export interface GPXSegment {
  trkpt: GPXPoint[];
}

export interface GPXResult {
  gpx: {
    trk: {
      trkseg: GPXSegment[];
    }
  }
}