import {useRawGpxSegment} from '@/stores/guide-generator/raw-gpx';

const TrailSegmentEditor = () => {
  // TODO 상세 구현 필요
  const rawGpxSegment = useRawGpxSegment((state) => state.segment);

  if (rawGpxSegment.length === 0) {
    return <div className="hidden"></div>;
  }

  return (
    <div className="layout">Success!</div>
  )
}

export default TrailSegmentEditor;
