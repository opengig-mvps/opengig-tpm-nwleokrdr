import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type JiraIntegrationRequestBody = {
  projectId: number;
  jiraAccountId: string;
};

export async function POST(request: Request) {
  try {
    const body: JiraIntegrationRequestBody = await request.json();

    const { projectId, jiraAccountId } = body;

    if (!projectId || !jiraAccountId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Validate the project exists
    const project = await prisma.project.findFirst({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    // Validate Jira account credentials and establish a connection
    // (Assume validation logic is implemented here)

    // Save the Jira account details in the database
    const jiraIntegration = await prisma.jiraIntegration.create({
      data: {
        projectId,
        jiraAccountId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Jira account connected successfully!',
      data: {
        id: jiraIntegration.id,
        createdAt: jiraIntegration.createdAt.toISOString(),
        projectId: jiraIntegration.projectId,
        updatedAt: jiraIntegration.updatedAt.toISOString(),
        jiraAccountId: jiraIntegration.jiraAccountId,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error connecting Jira account:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}