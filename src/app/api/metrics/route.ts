import { NextResponse } from 'next/server';
import { CandidateService } from '@/lib/candidate-service';

export async function GET() {
  try {
    const metrics = CandidateService.getMetrics();
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Failed to calculate metrics:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while calculating metrics' },
      { status: 500 }
    );
  }
}
