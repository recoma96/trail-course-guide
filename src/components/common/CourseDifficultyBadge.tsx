import { CourseDifficulty } from '@/types/track';
import React from 'react';

interface CourseDifficultyBadgeProps {
  difficulty: CourseDifficulty;
}

const CourseDifficultyBadge = ({ difficulty }: CourseDifficultyBadgeProps) => {
  const lighterColor = `${difficulty.color}B1`; // Adding alpha for a lighter effect

  return (
    <div className="w-[220px]">
      <div
        className="flex items-center rounded-t-md text-white"
        style={{
          background: `linear-gradient(to right, ${difficulty.color}, ${lighterColor})`,
        }}
      >
        <div className="w-[30%] p-1 text-center">Lv.{difficulty.value}</div>
        <div className="my-1 self-stretch border-l border-white" />
        <div className="w-[70%] p-1 text-center">{difficulty.code}</div>
      </div>
      <div
        className="rounded-b-md border-b-2 border-l-2 border-r-2 p-1 text-center font-bold"
        style={{
          borderColor: difficulty.color,
          color: difficulty.color,
        }}
      >
        {difficulty.koreanName}
      </div>
    </div>
  );
};

export default CourseDifficultyBadge;
