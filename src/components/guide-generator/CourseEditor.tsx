'use client'

import {z} from 'zod';
import {useCourse} from '@/stores/guide-generator/course';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {useEffect, useRef, useState} from 'react';
import {COURSE_DIFFICULTY_ENUM, TRACK_SEGMENT_DIFFICULTY_ENUM, TrackPoint, TrackSegment} from '@/types/track';
import {getCenterLocationFromTrackPoints} from '@/lib/geo';
import Script from 'next/script';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGenerateGuideStep} from '@/stores/guide-generator/generate-guide-step';
import {EDIT_COURSE_PAGE, SPLIT_SEGMENTS_PAGE} from '@/types/generate-step';
import {useRouter} from 'next/navigation';

const SegmentFormSchema = z.object({
  name: z.string().min(1, '구간 이름은 필수로 입력해야 해요.'),
  description: z.string(),
  difficulty: z.string().min(1),
});

const FormSchema = z.object({
  title: z.string().min(1, '코스 이름은 필수로 입력해야 해요.'),
  subTitle: z.string().min(1, '코스 부제목은 필수로 입력해야 해요.'),
  description: z.string().min(0),
  difficulty: z.string(),
  segments: z.array(SegmentFormSchema).min(1),
});

// FormSchema Input Output Type
type In = z.input<typeof FormSchema>;
type Out = z.infer<typeof FormSchema>;

const CourseEditor = () => {

  // Course Store Data
  const pageCode = useGenerateGuideStep((state) => state.stepCode);
  const setPageCode = useGenerateGuideStep((state) => state.setStepCode);
  const course = useCourse.getState().course;
  const resetCourse  = useCourse((state) => state.reset);
  const saveCourse  = useCourse((state) => state.save);

  // hooks
  const [isNaverMapApiLoaded, setIsNaverMapApiLoaded] = useState(false); // naver 모듈 로딩 완료 여부
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number>(0); // 선택된 구간(세그먼트) 인덱스
  const [isSaveComplete, setIsSaveComplete] = useState<boolean>(false);
  const router = useRouter();

  // refs
  const mapRef = useRef<naver.maps.Map | null>(null); // 네이버맵 변수
  const hasHydrated = useRef(false); // 하이드레이션 여부 함수
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);  // 중간저장 타이머 함수
  const saveDoneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // 중간저장완료 표시 관련 함수

  // form 데이터를 course에서 React Hook Form 으로 변환
  const toFormValues = (course: ReturnType<typeof useCourse.getState>['course']) => ({
    title: course.title ?? '',
    subTitle: course.subTitle ?? '',
    description: course.description ?? '',
    difficulty: course.difficulty?.code ?? COURSE_DIFFICULTY_ENUM[0].code,
    segments: course.segments.map(segment => ({
      name: segment.name ?? '',
      description: segment.description ?? '',
      difficulty: segment.difficulty?.code ?? TRACK_SEGMENT_DIFFICULTY_ENUM[0].code,
    })),
  });

  // form
  const form = useForm<In, undefined, Out>({ // Form Schema
    resolver: zodResolver(FormSchema),
    defaultValues: toFormValues(course),
  });

  // 네이버맵 렌더링
  useEffect(() => {
    if (isNaverMapApiLoaded && !mapRef.current) {
      // 네이버맵이 로드가 되었고, Ref 변수가 생성되지 않았을 경우
      const center = getCenterLocationFromTrackPoints(
        course.segments.reduce((acc: TrackPoint[], cur: TrackSegment) => acc.concat(cur.track), [])
      );
      mapRef.current = new naver.maps.Map('naver-map', {
        zoom: 15,
        center: new naver.maps.LatLng(center.latitude, center.longitude),
      });
    }
  }, [isNaverMapApiLoaded, course.segments, pageCode]);

  // 맵 위에 등산로 그리기
  useEffect(() => {
    if(isNaverMapApiLoaded && mapRef.current) {
      const map = mapRef.current;
      if (!map) return;

      const segments = useCourse.getState().course.segments;
      segments.forEach((segment, index) => {
        const strokeWeight = 8;
        const color = index == selectedSegmentIndex ? segment.difficulty.color : '#AAAAAA';

        const segmentPolyLine = new naver.maps.Polyline({
          map: map,
          path: segment.track.map((trackPoint) => new naver.maps.LatLng(trackPoint.latitude, trackPoint.longitude)),
          strokeColor: color,
          strokeWeight: strokeWeight,
          clickable: true,
        });
        naver.maps.Event.addListener(segmentPolyLine, 'click', () => {
          setSelectedSegmentIndex(index);
        });
      });
    }
  }, [isNaverMapApiLoaded, selectedSegmentIndex]);

  // 하이드레이션 완료 감지  (Store -> RHF 복사)
  useEffect(() => {
    if (!hasHydrated.current && course.segments.length) {
      form.reset(toFormValues(course));
      hasHydrated.current = true;
    }
  }, [course, form]);

  // 변경사항 있으면 저장 (RHF -> Store 복사)
  useEffect(() => {
    const sub = form.watch((values) => {
      // 하이드레이션 끝나지 않았을 경우 무시
      if (!hasHydrated.current || course.segments.length < 1) return;

      // 디바운스
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveCourse({
          title: values.title ?? '',
          subTitle: values.subTitle ?? '',
          description: values.description ?? '',
          difficulty: COURSE_DIFFICULTY_ENUM.find(difficulty => difficulty.code === values.difficulty) ?? COURSE_DIFFICULTY_ENUM[0],
          segments: (values.segments ?? []).map((segment, index) => ({
            name: segment?.name ?? '',
            description: segment?.description ?? '',
            difficulty: TRACK_SEGMENT_DIFFICULTY_ENUM.find(difficulty => difficulty.code === segment?.difficulty) ?? TRACK_SEGMENT_DIFFICULTY_ENUM[0],
            track: course.segments[index].track,
          }))
        });

        // 저장 완료 토스트 실행
        if (saveDoneTimerRef.current) clearTimeout(saveDoneTimerRef.current);
        setIsSaveComplete(true);
        saveDoneTimerRef.current = setTimeout(() => {
          setIsSaveComplete(false);
        }, 1000);
      }, 1000);
    });
    return () => {
      sub.unsubscribe();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (saveDoneTimerRef.current) clearTimeout(saveDoneTimerRef.current);
    }
  }, [form, course.segments, saveCourse]);

  // 결과 페이지로 넘아가기 위한 핸들러 함수
  const submitHandler = (data: Out) => {
    router.push('/guide-generator/result');
  }

  // 세그먼트 Form Field
  const { fields: segmentFields } = useFieldArray({
    control: form.control,
    name: 'segments',
  });

  // course 데이터가 세팅이 되어있지 않음
  if (pageCode !== EDIT_COURSE_PAGE || !hasHydrated.current) return (<div className="hidden"></div>);

  const prevHandler = () => {
    mapRef.current = null;
    resetCourse();
    setPageCode(SPLIT_SEGMENTS_PAGE);
  }

  const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  return (
    <div className="layout">
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}`}
        onReady={() => setIsNaverMapApiLoaded(true)}
      />

      <div className="flex justify-between items-center">
        <p>코스 내용 작성하기 </p>
        <p>{isSaveComplete ? '자동저장 완료' : ''}</p>
      </div>
      <p className="text-sm">정보를 수정할 때마다 2초 간격으로 자동 저장됩니다.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="mt-11 space-y-8">
          <FormField
            name="title"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>코스 이름</FormLabel>
                <FormControl>
                  <Input id="title" type="text" placeholder="설악산 오색코스" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="subTitle"
            control={form.control}
            render={({field}) => (
               <FormItem>
                  <FormLabel>코스 부제목 (카테고리)</FormLabel>
                  <FormControl>
                    <Input id="sub-title" type="text" placeholder="강원특별자치도 양양군 - 설악산국립공원" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          <FormField
            name="description"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>코스 설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="이 코스에 대한 설명을 적어주세요."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="difficulty"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>코스 난이도</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="난이도를 선택해 주세요." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COURSE_DIFFICULTY_ENUM.map((difficulty, index) => (
                      <SelectItem key={index} value={difficulty.code}>Lv.{difficulty.value} | {difficulty.koreanName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <hr />
          <div id="naver-map" className="h-200 mb-10"></div>
          <hr />
          {
            segmentFields.map((segment, index) => (
              <div key={index} className={`space-y-8 ${index != selectedSegmentIndex ? "hidden" : ""}`}>
                <h2>구간 {index+1}번</h2>
                <FormField
                  name={`segments.${index}.name`}
                  control={form.control}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>구간 이름</FormLabel>
                      <FormControl>
                        <Input id={`segments.${index}.name`} type="text" placeholder="남설악탐방지원센터 - 오색1쉼터" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`segments.${index}.description`}
                  control={form.control}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>구간 설명</FormLabel>
                      <FormControl>
                        <Textarea placeholder="이 구간에 대한 설명을 적어주세요." className="resize-none" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`segments.${index}.difficulty`}
                  control={form.control}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>난이도</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="난이도를 선택해 주세요." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRACK_SEGMENT_DIFFICULTY_ENUM.map((difficulty, index) => (
                            <SelectItem key={index} value={difficulty.code}>Lv.{difficulty.value} | {difficulty.koreanName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            ))
          }
          <hr />
          <div className="flex mt-4">
            <Button className="mr-auto block" type="button" variant="destructive" onClick={prevHandler}>뒤로</Button>
            <div className="ml-auto block space-x-4">
              <Button type="submit">페이지 생성하기</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CourseEditor;