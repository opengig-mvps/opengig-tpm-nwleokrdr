import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ProjectRequestBody = {
  name: string;
  adminId: number;
  startDate: string;
  description: string;
};

export async function POST(request: Request) {
  try {
    const body: ProjectRequestBody = await request.json();

    const { name, adminId, startDate, description } = body;

    if (!name || !adminId || !startDate || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const admin = await prisma.user.findFirst({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        adminId,
        subtasks: {
          create: [
            { name: 'Requirement Gathering', code: 'REQ-001' },
            { name: 'Technical Design', code: 'TECH-001' },
            { name: 'UI Design', code: 'UI-001' },
            { name: 'Coding', code: 'CODE-001' },
            { name: 'Testing', code: 'TEST-001' },
            { name: 'Deployment', code: 'DEP-001' },
          ],
        },
      },
      include: {
        subtasks: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Project created successfully!',
      data: {
        id: project.id,
        name: project.name,
        adminId: project.adminId,
        subtasks: project.subtasks.map((subtask) => ({
          id: subtask.id,
          code: subtask.code,
          name: subtask.name,
          projectId: subtask.projectId,
        })),
        createdAt: project.createdAt.toISOString(),
        startDate: project.startDate.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        description: project.description,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}