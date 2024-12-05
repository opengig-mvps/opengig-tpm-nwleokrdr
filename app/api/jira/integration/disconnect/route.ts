import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Fetch the Jira integration for the specified project
    const jiraIntegration = await prisma.jiraIntegration.findUnique({
      where: {
        projectId: 1, // Assuming projectId is known and is 1 for this example
      },
    });

    if (!jiraIntegration) {
      return NextResponse.json({ success: false, message: 'Jira integration not found for the specified project.' }, { status: 404 });
    }

    // Remove the Jira account details from the database
    await prisma.jiraIntegration.delete({
      where: {
        id: jiraIntegration.id,
      },
    });

    // Return a success message upon successful disconnection
    return NextResponse.json({
      success: true,
      message: 'Jira account disconnected successfully!',
      data: {
        id: jiraIntegration.id,
        createdAt: jiraIntegration.createdAt.toISOString(),
        projectId: jiraIntegration.projectId,
        updatedAt: jiraIntegration.updatedAt.toISOString(),
        jiraAccountId: jiraIntegration.jiraAccountId,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error disconnecting Jira account:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}