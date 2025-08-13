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

const FormSchema = z.object({
  file: z.preprocess(
    (val) => (val instanceof FileList ? val.item(0): val),
    z.instanceof(File, {message: '파일을 선택하세요.'}),
  )
});

type In = z.input<typeof FormSchema>;
type Out = z.infer<typeof FormSchema>;

const GpxParserForm = () => {
  const updateRawGpxSegment = useRawGpxSegment((state) => state.init)
  const form = useForm<In, undefined, Out>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

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
                <FormLabel>GPX 파일 파싱</FormLabel>
                <FormControl>
                  <Input id="gpx" type="file" accept=".gpx" onChange={(e) => field.onChange(e.target.files)}/>
                </FormControl>
                <FormDescription>
                  GPX파일을 파싱합니다.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button className="mt-4 ml-auto block" type="submit">파싱</Button>
        </form>
      </Form>
    </div>
  )
}

export default GpxParserForm;