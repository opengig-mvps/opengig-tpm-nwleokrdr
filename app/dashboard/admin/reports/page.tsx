'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-picker';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { isAxiosError } from 'axios';
import { LoaderCircleIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const reportSchema = z.object({
  teamMember: z.string().min(1, 'Please select a team member or project'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
}).refine(data => data.startDate < data.endDate, {
  message: 'Start date must be before end date',
  path: ['endDate'],
});

type ReportFormData = z.infer<typeof reportSchema>;

const ReportGenerator: React.FC = () => {
  const { data: session } = useSession();
  const [selectedDates, setSelectedDates] = useState<{ start: Date | undefined, end: Date | undefined }>({ start: undefined, end: undefined });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    try {
      const payload = {
        teamMember: data?.teamMember,
        startDate: data?.startDate?.toISOString(),
        endDate: data?.endDate?.toISOString(),
      };

      const response = await api?.post(`/api/admin/reports`, payload);

      if (response?.data?.success) {
        toast?.success('Report generated successfully!');
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast?.error(error?.response?.data?.message ?? 'Something went wrong');
      } else {
        console.error(error);
        toast?.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Generate Report</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamMember">Team Member / Project</Label>
              <Select {...register('teamMember')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a team member or project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member1">Team Member 1</SelectItem>
                  <SelectItem value="member2">Team Member 2</SelectItem>
                  <SelectItem value="project1">Project 1</SelectItem>
                  <SelectItem value="project2">Project 2</SelectItem>
                </SelectContent>
              </Select>
              {errors?.teamMember && <p className="text-red-500 text-sm">{errors?.teamMember?.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DateTimePicker
                  date={selectedDates?.start}
                  setDate={(date: any) => setSelectedDates({ ...selectedDates, start: date })}
                />
                {errors?.startDate && <p className="text-red-500 text-sm">{errors?.startDate?.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <DateTimePicker
                  date={selectedDates?.end}
                  setDate={(date: any) => setSelectedDates({ ...selectedDates, end: date })}
                />
                {errors?.endDate && <p className="text-red-500 text-sm">{errors?.endDate?.message}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ReportGenerator;