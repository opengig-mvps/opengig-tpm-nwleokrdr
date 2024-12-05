'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { isAxiosError } from 'axios';
import api from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderCircleIcon } from 'lucide-react';

const workLogSchema = z.object({
  project: z.string().min(1, 'Project selection is required'),
  subtask: z.string().min(1, 'Subtask selection is required'),
  hours: z
    .string()
    .min(1, 'Hours worked is required')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Please enter a valid positive number'
    ),
  description: z.string().min(1, 'Description is required'),
});

type WorkLogFormData = z.infer<typeof workLogSchema>;

const LogWorkPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkLogFormData>({
    resolver: zodResolver(workLogSchema),
  });

  const onSubmit = async (data: WorkLogFormData) => {
    try {
      setLoading(true);
      const payload = {
        project: data?.project,
        subtask: data?.subtask,
        hours: Number(data?.hours),
        description: data?.description,
      };

      const response = await api.post(
        `/api/users/${session?.user?.id}/work-logs`,
        payload
      );

      if (response?.data?.success) {
        toast.success('Work log created successfully!');
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? 'Something went wrong');
      } else {
        console.error(error);
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Log Work Hours</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Work Log Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select {...register('project')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project1">Project 1</SelectItem>
                  <SelectItem value="project2">Project 2</SelectItem>
                </SelectContent>
              </Select>
              {errors?.project && (
                <p className="text-red-500 text-sm">{errors?.project?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtask">Subtask</Label>
              <Select {...register('subtask')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subtask" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subtask1">Subtask 1</SelectItem>
                  <SelectItem value="subtask2">Subtask 2</SelectItem>
                </SelectContent>
              </Select>
              {errors?.subtask && (
                <p className="text-red-500 text-sm">{errors?.subtask?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Hours Worked</Label>
              <Input
                {...register('hours')}
                type="number"
                placeholder="Enter hours worked"
              />
              {errors?.hours && (
                <p className="text-red-500 text-sm">{errors?.hours?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Describe the task"
              />
              {errors?.description && (
                <p className="text-red-500 text-sm">
                  {errors?.description?.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {loading ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Logging Work...
                </>
              ) : (
                'Log Work'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LogWorkPage;