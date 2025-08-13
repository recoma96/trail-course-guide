'use client'

import GpxParserForm from '@/components/guide-generator/GpxParserForm';
import TrailSegmentEditor from '@/components/guide-generator/TrailSegmentEditor';
import CourseEditor from '@/components/guide-generator/CourseEditor';

const GuideGeneratorPage = () => {
  return (
    <div>
      <GpxParserForm />
      <TrailSegmentEditor />
      <CourseEditor />
    </div>
  );
};

export default GuideGeneratorPage;