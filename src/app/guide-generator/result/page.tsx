'use client'

import CourseGuideComponent from '@/components/guide-generator/CourseGuideComponent';
import {Button} from '@/components/ui/button';
import {useRef} from 'react';
import * as htmlToImage from 'html-to-image';

const GuideGeneratorResultPage = () => {
  const ref = useRef<HTMLDivElement>(null);

  const exportPNG = async () => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current, {
      pixelRatio: 3,           // ↑ 고화질 (2~4 권장)
      cacheBust: true,
      backgroundColor: '#fff', // 투명 배경 방지
      skipFonts: false,
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'component.png';
    a.click();
  }

  return (
    <div className="layout">
      <div ref={ref}>
        <CourseGuideComponent />
      </div>
      <Button className="w-full" onClick={exportPNG}>PNG 인쇄</Button>
    </div>
  );
}

export default GuideGeneratorResultPage;
