'use client';

import React, { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { LoaderCircleIcon } from 'lucide-react';

const projectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.date().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const AdminProjectsPage: React.FC = () => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/projects');
      setProjects(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = {
        projectName: data?.projectName,
        description: data?.description,
        startDate: selectedDate ? selectedDate.toISOString() : undefined,
      };

      const response = await axios.post('/api/admin/projects', payload);

      if (response?.data?.success) {
        toast.success('Project created successfully!');
        fetchProjects();
        reset();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? 'Something went wrong');
      } else {
        console.error(error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                {...register('projectName')}
                placeholder="Enter project name"
              />
              {errors?.projectName && (
                <p className="text-red-500 text-sm">
                  {errors?.projectName?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                {...register('description')}
                placeholder="Enter project description"
              />
              {errors?.description && (
                <p className="text-red-500 text-sm">
                  {errors?.description?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <DateTimePicker
                date={selectedDate}
                setDate={(date: Date) => setSelectedDate(date)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Project...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <h2 className="text-2xl font-bold mt-8 mb-6">Projects List</h2>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Total Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project: any) => (
              <TableRow key={project?.id}>
                <TableCell>{project?.projectName}</TableCell>
                <TableCell>{project?.description}</TableCell>
                <TableCell>{project?.totalTimeSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminProjectsPage;