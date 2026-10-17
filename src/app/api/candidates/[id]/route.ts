import { NextRequest, NextResponse } from 'next/server';
import { CandidateService } from '@/lib/candidate-service';
import { Stage } from '@/types/ats';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidate = CandidateService.getById(id);

    if (!candidate) {
      return NextResponse.json(
        { success: false, message: 'Candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: candidate });
  } catch (error) {
    console.error('Failed to get candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if adding a note
    if (body.action === 'addNote') {
      const { text, author, role, rating } = body;
      if (!text) {
        return NextResponse.json(
          { success: false, message: 'Note text is required' },
          { status: 400 }
        );
      }
      const updated = CandidateService.addNote(
        id,
        text,
        author || 'Recruiter',
        role || 'Talent Acquisition',
        rating
      );
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Candidate not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Note added', data: updated });
    }

    // Check if updating stage only
    if (body.stage && Object.keys(body).length <= 3) {
      const updated = CandidateService.updateStage(
        id,
        body.stage as Stage,
        body.author || 'Recruiter',
        body.note
      );
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Candidate not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Stage updated', data: updated });
    }

    // Full or partial update
    const updated = CandidateService.update(id, body, body.author || 'Recruiter');
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Candidate updated', data: updated });
  } catch (error) {
    console.error('Failed to update candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = CandidateService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Candidate not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Failed to delete candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
