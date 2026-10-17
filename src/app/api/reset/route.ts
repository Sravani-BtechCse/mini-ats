import { NextResponse } from 'next/server';
import { CandidateService } from '@/lib/candidate-service';

export async function POST() {
  try {
    const defaultCandidates = CandidateService.resetToDefault();
    return NextResponse.json({
      success: true,
      message: 'Database reset to default demo candidates',
      data: defaultCandidates,
    });
  } catch (error) {
    console.error('Failed to reset candidates:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
