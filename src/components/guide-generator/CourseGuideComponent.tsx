'use client'

import {useCourse} from '@/stores/guide-generator/course';
import {useEffect, useRef, useState} from 'react';
import CourseDifficultyBadge from '@/app/guide-generator/common/CourseDifficultyBadge';
import Script from 'next/script';
import {getCenterLocationFromTrackPoints} from '@/lib/geo';
import {TrackPoint, TrackSegment} from '@/types/track';

const CourseGuideComponent = () => {
  const course = useCourse((state) => state.course);

  // hooks
  const [isMounted, setIsMounted] = useState(false);
  const [isNaverMapApiLoaded, setIsNaverMapApiLoaded] = useState(false); // naver 모듈 로딩 완료 여부

  // refs
  const mapRef = useRef<naver.maps.Map | null>(null);

  // hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 네이버맵 렌더링
  useEffect(() => {
    if (!isNaverMapApiLoaded || mapRef.current) return;

    // 중앙 위경도 설정
    const center = getCenterLocationFromTrackPoints(
      course.segments.reduce((acc: TrackPoint[], cur: TrackSegment) => acc.concat(cur.track), [])
    );

    // 맵 생성
    mapRef.current = new naver.maps.Map('naver-map', {
      zoom: 15,
      center: new naver.maps.LatLng(center.latitude, center.longitude),
    });

    const map = mapRef.current;

    // 등산로 그리기
    course.segments.forEach((segment, index) => {
      const strokeWeight = 6;
      const color = `${segment.difficulty.color}AA`;

      const startMarker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(segment.track[0].latitude, segment.track[0].longitude),
        icon: {
          content: `<div style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; background-color: ${segment.difficulty.color}; border-radius: 50%; color: white; font-size: 12px; font-weight: bold;">${index + 1}</div>`,
          size: new naver.maps.Size(10, 10),
        },
        clickable: true,
      });

      const polyLine = new naver.maps.Polyline({
        map: map,
        path: segment.track.map((trackPoint) => new naver.maps.LatLng(trackPoint.latitude, trackPoint.longitude)),
        strokeColor: color,
        strokeWeight: strokeWeight,
      });
    });
  }, [isNaverMapApiLoaded]);

  // 하이드레이션 적용 전 로딩 처리
  if (!isMounted) return <div>Loading</div>

  const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  return (
    <div>
      {/* 네이버 맵 스크립트 부분 */}
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}`}
        onReady={() => setIsNaverMapApiLoaded(true)}
      />

      {/* 타이틀 부분. 코스 제목과 난이도 뱃지가 들어간다. */}
      <div className="flex flex-col mb-10 items-center">
        <h1>{course.title}</h1>
        <p className="mb-5">{course.subTitle}</p>
        <CourseDifficultyBadge difficulty={course.difficulty} />
      </div>
      <div className="mt-5">
        {course.description}
      </div>
      <hr />
      <div id="naver-map" className={`h-200`} style={{ border: `5px solid ${course.difficulty.color}AA`}}></div>
      <hr />

      <div>
        { course.segments.map((segment, index) => (
          <div key={index} className="mb-10 border rounded-lg overflow-hidden">
            {/* 상단 제목 부분 */}
            <div
              className="px-4 py-2 font-bold text-white"
              style={{
                background: `linear-gradient(to right, ${segment.difficulty.color}, ${segment.difficulty.color} 20%, ${segment.difficulty.color}15)`,
              }}
            >
              {index + 1}. {segment.name} [{segment.difficulty.koreanName}]
            </div>
            {/* 하단 내용 부분 */}
            <div className="p-4">
              <p>{segment.description}</p>
            </div>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
}

export default CourseGuideComponent;