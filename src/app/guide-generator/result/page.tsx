'use client'

import CourseGuideComponent from '@/components/guide-generator/CourseGuideComponent';
import {Button} from '@/components/ui/button';
import {useRef} from 'react';
import * as htmlToImage from 'html-to-image';
import {useGenerateGuideStep} from '@/stores/guide-generator/generate-guide-step';
import {UPLOAD_GPX_PAGE} from '@/types/generate-step';
import {useRouter} from 'next/navigation';
import {useCourse} from '@/stores/guide-generator/course';

const GuideGeneratorResultPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const setStepCode = useGenerateGuideStep((state) => state.setStepCode);
  const resetCourse = useCourse((state) => state.reset);
  const router = useRouter();

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

  const resetHandler = () => {
    setStepCode(UPLOAD_GPX_PAGE);
    resetCourse();
    router.push('/guide-generator');
  }

  return (
    <div className="layout">
      <div ref={ref}>
        <CourseGuideComponent />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button className="w-full" onClick={exportPNG}>PNG 인쇄</Button>
        <Button variant="secondary" className="w-full" onClick={() => router.push('/guide-generator')}>뒤로가기</Button>
        <Button variant="secondary" className="w-full" onClick={resetHandler}>처음부터 하기</Button>
      </div>
    </div>
  );
}

export default GuideGeneratorResultPage;
