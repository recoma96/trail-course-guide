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
  const course = useCourse((state) => state.course);

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
    a.download = `${course.title || 'course-guide'}.png`;
    a.click();
  }

  const exportJSON = () => {
    if (!course) return;

    const jsonData: Partial<object> = {
      title: course.title,
      subTitle: course.subTitle,
      difficulty: {
        code: course.difficulty.code,
        name: course.difficulty.koreanName,
        value: course.difficulty.value,
      },
      description: course.description,
      segments: course.segments?.map(segment => ({
          name: segment.name,
          difficulty: {
            code: segment.difficulty.code,
            name: segment.difficulty.koreanName,
            value: segment.difficulty.value,
          },
          description: segment.description,
          track: segment.track.map(point => ({
            lat: point.latitude,
            lon: point.longitude,
            ele: point.elevation,
          })),
        })
      )
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title || 'course-guide'}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="flex flex-row gap-2">
          <Button className="flex-1" onClick={exportPNG}>PNG 인쇄</Button>
          <Button className="flex-2" onClick={exportJSON}>JSON파일 추출</Button>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="secondary" className="flex-2" onClick={() => router.push('/guide-generator')}>뒤로가기</Button>
          <Button variant="destructive" className="flex-1" onClick={resetHandler}>처음부터 하기</Button>
        </div>
      </div>
    </div>
  );
}

export default GuideGeneratorResultPage;
