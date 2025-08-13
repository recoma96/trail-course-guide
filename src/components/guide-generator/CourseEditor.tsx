'use client'

import {useCourse} from '@/stores/guide-generator/course';

const CourseEditor = () => {
  const course = useCourse((state) => state.course);
  console.log(course.segments);

  // course 데이터가 세팅이 되어있지 않음
  if (course.segments.length === 0) return (<div className="hidden"></div>);

  console.log(course.segments);

  return (
    <div className="layout">
      <h1>Hello World</h1>
    </div>
  )
}

export default CourseEditor;