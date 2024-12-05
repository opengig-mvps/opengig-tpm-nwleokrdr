import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define the type for the request body
type WorkLogRequestBody = {
  hours: number;
  projectId: number;
  subtaskId: number;
  description: string;
};

// Define the POST method handler for work log creation
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: WorkLogRequestBody = await request.json();

    // Validate required fields
    const { hours, projectId, subtaskId, description } = body;
    if (!projectId || !subtaskId || !description || typeof hours !== 'number' || hours <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid input fields' }, { status: 400 });
    }

    // Create the work log entry
    const workLog = await prisma.workLog.create({
      data: {
        hours,
        projectId,
        subtaskId,
        description,
        userId: 1, // Assuming userId is 1 for demonstration; replace with actual userId
      },
    });

    // Send a success response with the created work log
    return NextResponse.json({
      success: true,
      message: 'Work log created successfully!',
      data: {
        id: workLog.id,
        date: workLog.date.toISOString(),
        hours: workLog.hours,
        userId: workLog.userId,
        createdAt: workLog.createdAt.toISOString(),
        projectId: workLog.projectId,
        subtaskId: workLog.subtaskId,
        updatedAt: workLog.updatedAt.toISOString(),
        description: workLog.description,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating work log:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}