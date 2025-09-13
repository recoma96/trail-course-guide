import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="w-3/5 max-w-xl">
        <div className="text-center">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">Trail Course Guide</h1>
            <p className="mt-2 text-md text-gray-500">하이킹/트레킹 코스 관련 가이드 페이지</p>
          </div>
          <div className="flex justify-between">
            <Button asChild size="lg">
              <Link href="/guide-generator">코스 가이드 만들기</Link>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* disabled 버튼에 툴팁을 적용하려면 감싸는 요소가 필요합니다. */}
                  <span tabIndex={0}>
                    <Button disabled size="lg">코스 검색하기</Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>출시 예정이에요!</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;