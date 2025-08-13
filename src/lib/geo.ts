import {TrackPoint} from '@/types/track';

export function getCenterLocationFromTrackPoints(trackPoints: TrackPoint[]): {latitude: number, longitude: number} {
  const latitudes = trackPoints.map(point => point.latitude);
  const longitudes = trackPoints.map(point => point.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2
  };
}