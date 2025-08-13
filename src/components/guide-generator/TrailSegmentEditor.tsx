'use client';

import {useRawGpxSegment} from '@/stores/guide-generator/raw-gpx';
import {useCallback, useEffect, useRef, useState} from 'react';
import {getCenterLocationFromTrackPoints} from '@/lib/geo';
import Script from 'next/script';
import {Button} from '@/components/ui/button';

const createMarkerIcon = (isEndPoint: boolean) => {
  const color = isEndPoint ? 'yellow' : 'blue';
  return'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="5" fill="${color}"/></svg>`);
}

const TrailSegmentEditor = () => {
  const segment = useRawGpxSegment((state) => state.segment);
  const updateTrackPoint = useRawGpxSegment((state) => state.update);
  const initSegment = useRawGpxSegment((state) => state.init);

  // naver 모듈 로딩 완료 여부
  const [isNaverMapApiLoaded, setIsNaverMapApiLoaded] = useState(false);

  // 네이버맵 컴포넌트
  const mapRef = useRef<naver.maps.Map | null>(null);

  // 네이버맵 렌더링
  const createMap = useCallback(() => {
    if (segment.length === 0) return;

    // 네이버 맵은 처음일 때만 생성
    if (!mapRef.current) {
      const center = getCenterLocationFromTrackPoints(segment);
      mapRef.current = new naver.maps.Map('naver-map', {
        zoom: 15,
        center: new naver.maps.LatLng(center.latitude, center.longitude),
      });
    }
    const map = mapRef.current;

    // 마커 생성
    segment.forEach((point, idx) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(point.latitude, point.longitude),
        map: map,
        icon: createMarkerIcon(point.isEndPoint)
      });
      naver.maps.Event.addListener(marker, 'click', () => {
        point.isEndPoint = !point.isEndPoint;
        updateTrackPoint(idx, point);
      });
    });
  }, [segment]);

  // segment 내용이 바뀔 때마다 리렌더링
  useEffect(() => {
    if (isNaverMapApiLoaded && segment.length > 0) {
      createMap();
    }
  }, [isNaverMapApiLoaded, segment]);

  // 초기화 버튼 핸들러
  const initButtonHandler = () => {
    mapRef.current = null;
    initSegment([]);
  }

  // 아직 GPX 데이터가 올라오지 않았을 경우 숨김처리
  if (segment.length === 0) return (<div className="hidden"></div>)

  const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  return (
    <div className="layout">
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}`}
        onReady={() => setIsNaverMapApiLoaded(true)}
      />
      <div className="mb-5">
        <p className="text-lg">구간 나누기 (엔드포인트 설정)</p>
        <p className="text-sm">파란색 모양의 트랙 포인트를 클릭하면, 포인트가 노란색으로 변했는데, 이는 그 포인트를 기준으로 구간을 둘로 나눈다는 것을 의미합니다 </p>
      </div>
      <div id="naver-map" className="h-200 mb-10"></div>
      <div className="flex">
        <Button type="button" className="mr-auto block" variant="destructive" onClick={initButtonHandler}>뒤로</Button>
        <Button type="button" className="ml-auto block">다음</Button>
      </div>
    </div>
  )
}

export default TrailSegmentEditor;