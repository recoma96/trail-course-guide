import {NextResponse} from 'next/server';
import {XMLParser} from 'fast-xml-parser';
import {TrackPoint} from '@/types/track';
import {GPXResult} from '@/types/gpx';

export const POST = async (req: Request) => {
  const form  = await req.formData();
  const file: File | string | null = form.get('file');
  if (!(file && file instanceof File)) {
    return NextResponse.json({error: '파일을 업로드해 주세요.'}, {status: 400});
  }

  // TODO 필요시 GPX 포맷인지 추가 검증 로직 필요

  // trkpt를 추출해서 리스트 생성
  const text = await file.text();

  // XML 파서 생성
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  try {
    // 파싱된 데이터를 GPX 포맷으로 세팅
    // TODO GPXResult로 맞춘다 해도, 실제 Validation을 진행하지 않기 때문에 관련 코드 추가 작성 필요
    const result = parser.parse(text) as GPXResult;
    const gpxSegments = result.gpx.trk.trkseg;  // 이 안에 트랙 데이터가 들어있다.

    const parsedTrackPoints: TrackPoint[] = [];

    // GPX 데이터 배열로 추출
    gpxSegments.forEach((segment) => {
      const trackPoints = segment.trkpt;
      if (!Array.isArray(trackPoints)) {
        // 배열이 아닐 경우 -> 트랙 구간이 아닌 것으로 간주\
        return;
      }
      trackPoints.forEach((point) => {
        parsedTrackPoints.push({
          latitude: point.lat,
          longitude: point.lon,
          elevation: point.ele,
        })
      });
    });
    return NextResponse.json({trackPoints: parsedTrackPoints});
  } catch {
    return NextResponse.json({error: 'Failed to parse GPX file'}, {status: 400});
  }
};
