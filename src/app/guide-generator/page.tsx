'use client'

import GpxParserForm from '@/components/guide-generator/GpxParserForm';
import TrailSegmentEditor from '@/components/guide-generator/TrailSegmentEditor';

const GuideGeneratorPage = () => {
  return (
    <div>
      <GpxParserForm />
      <TrailSegmentEditor />
    </div>
  );
};

export default GuideGeneratorPage;