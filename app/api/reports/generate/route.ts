import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReportRequestBody = {
  userId?: number;
  dateRange: string;
  projectId?: number;
};

export async function POST(request: Request) {
  try {
    const body: ReportRequestBody = await request.json();

    const { userId, dateRange, projectId } = body;

    if (!dateRange) {
      return NextResponse.json({ success: false, message: 'Invalid date range' }, { status: 400 });
    }

    const workLogs = await prisma.workLog.findMany({
      where: {
        AND: [
          userId ? { userId } : {},
          projectId ? { projectId } : {},
          {
            date: {
              gte: new Date(dateRange.split(' - ')[0]),
              lte: new Date(dateRange.split(' - ')[1]),
            },
          },
        ],
      },
      include: {
        user: true,
        project: true,
        subtask: true,
      },
    });

    const reportData: any = {};

    workLogs.forEach((log) => {
      if (!reportData[log.userId]) {
        reportData[log.userId] = {
          userName: log.user.name,
          projects: {},
        };
      }

      if (!reportData[log.userId].projects[log.projectId]) {
        reportData[log.userId].projects[log.projectId] = {
          projectName: log.project.name,
          totalHours: 0,
          subtasks: {},
        };
      }

      const projectData = reportData[log.userId].projects[log.projectId];
      projectData.totalHours += log.hours;

      if (!projectData.subtasks[log.subtaskId]) {
        projectData.subtasks[log.subtaskId] = {
          subtaskName: log.subtask.name,
          hours: 0,
        };
      }

      projectData.subtasks[log.subtaskId].hours += log.hours;
    });

    const formattedReportData = Object.values(reportData).map((user: any) => ({
      userId: user.userId,
      userName: user.userName,
      projects: Object.values(user.projects).map((project: any) => ({
        projectId: project.projectId,
        projectName: project.projectName,
        totalHours: project.totalHours,
        subtasks: Object.values(project.subtasks).map((subtask: any) => ({
          subtaskId: subtask.subtaskId,
          subtaskName: subtask.subtaskName,
          hours: subtask.hours,
        })),
      })),
    }));

    const report = await prisma.report.create({
      data: {
        userId,
        projectId,
        dateRange,
        reportData: formattedReportData,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Report generated successfully!',
      data: {
        reportId: report.id,
        reportData: formattedReportData,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}