import CourseGuideComponent from '@/components/guide-generator/CourseGuideComponent';
import {Button} from '@/components/ui/button';

const GuideGeneratorResultPage = () => {
  return (
    <div className="layout">
      <CourseGuideComponent />
      <Button className="w-full">PNG 인쇄</Button>
    </div>
  );
}

export default GuideGeneratorResultPage;
