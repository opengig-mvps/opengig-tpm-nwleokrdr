import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const reportId = parseInt(params.reportId, 10);
    if (isNaN(reportId)) {
      return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ success: false, message: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Report fetched successfully!',
      data: {
        reportId: report.id,
        reportData: report.reportData,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}