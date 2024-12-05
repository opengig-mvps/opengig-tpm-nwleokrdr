import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = parseInt(params.projectId, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ success: false, message: 'Invalid project ID' }, { status: 400 });
    }

    const jiraIntegration = await prisma.jiraIntegration.findUnique({
      where: { projectId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
        jiraAccountId: true,
      },
    });

    if (!jiraIntegration) {
      return NextResponse.json({ success: false, message: 'Jira integration not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Jira integration status fetched successfully!',
      data: jiraIntegration,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching Jira integration status:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}