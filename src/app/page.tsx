import { Button } from '@/components/ui/button';
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
            <Button disabled size="lg">
              코스 검색하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;