"use client";

import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {TrackPoint} from '@/types/track';
import {ErrorResponse} from '@/types/error';
import {useRawGpxSegment} from '@/stores/guide-generator/raw-gpx';
import {useGenerateGuideStep} from '@/stores/guide-generator/generate-guide-step';
import {SPLIT_SEGMENTS_PAGE, UPLOAD_GPX_PAGE} from '@/types/generate-step';

// Submit Form Schema
const FormSchema = z.object({
  file: z.preprocess(
    (val) => (val instanceof FileList ? val.item(0): val),
    z.instanceof(File, {message: '파일을 선택하세요.'}),
  )
});

// Input, Output Form Types
type In = z.input<typeof FormSchema>;
type Out = z.infer<typeof FormSchema>;

const GpxParserForm = () => {
  const pageCode = useGenerateGuideStep((state) => state.stepCode);
  const setPageCode = useGenerateGuideStep((state) => state.setStepCode);
  const updateRawGpxSegment = useRawGpxSegment((state) => state.init)
  const form = useForm<In, undefined, Out>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  if (pageCode !== UPLOAD_GPX_PAGE) return (<div className="hidden"></div>);

  // GPX 업로드 버튼 핸들러
  const submitHandler = (data: Out) => {
    const formData = new FormData();
    formData.append('file', data.file);

    fetch('/api/parse-gpx', {method: 'POST', body: formData})
      .then(async (res) => {
        if (!res.ok) {
          const errorResponse: ErrorResponse = await res.json();
          throw new Error(errorResponse.error);
        }
        return res.json() as Promise<{trackPoints: TrackPoint[]}>;
      }).then((data) => {
        updateRawGpxSegment(data.trackPoints);
        setPageCode(SPLIT_SEGMENTS_PAGE);
      }).catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="layout">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="mt-11">
          <FormField
            name="file"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>트레킹/하이킹 코스 데이터 추출</FormLabel>
                <FormControl>
                  <Input id="gpx" type="file" accept=".gpx" onChange={(e) => field.onChange(e.target.files)}/>
                </FormControl>
                <FormDescription>
                  GPX파일을 분석해서 코스를 파싱합니다.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button className="mt-4 ml-auto block" type="submit">업로드</Button>
        </form>
      </Form>
    </div>
  )
}

export default GpxParserForm;