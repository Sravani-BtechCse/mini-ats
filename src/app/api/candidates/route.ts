import { NextRequest, NextResponse } from 'next/server';
import { CandidateService, CandidateFilters } from '@/lib/candidate-service';
import { Stage } from '@/types/ats';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || undefined;
    const stage = (searchParams.get('stage') as Stage | 'all') || undefined;
    const department = searchParams.get('department') || undefined;
    const role = searchParams.get('role') || undefined;
    const minExpStr = searchParams.get('minExp');
    const minExperience = minExpStr ? parseInt(minExpStr, 10) : undefined;
    const sortBy = (searchParams.get('sortBy') as CandidateFilters['sortBy']) || undefined;

    const candidates = CandidateService.getAll({
      query,
      stage,
      department,
      role,
      minExperience,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while fetching candidates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and role are required fields.' },
        { status: 400 }
      );
    }

    const newCandidate = CandidateService.create({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '+91 90000 00000',
      role: body.role.trim(),
      department: body.department || 'Engineering',
      stage: body.stage || 'applied',
      experienceYears: Number(body.experienceYears) || 0,
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(',').map((s: string) => s.trim()) : ['React', 'JavaScript']),
      rating: Number(body.rating) || 3,
      location: body.location?.trim() || 'Bengaluru, Karnataka',
      expectedSalary: body.expectedSalary?.trim() || '₹20,000 / month',
      currentCompany: body.currentCompany?.trim() || undefined,
      education: body.education?.trim() || undefined,
      resumeUrl: body.resumeUrl?.trim() || undefined,
      resumeSummary: body.resumeSummary?.trim() || 'Candidate profile submitted via ATS portal.',
    });

    return NextResponse.json(
      { success: true, message: 'Candidate created successfully', data: newCandidate },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while creating candidate' },
      { status: 500 }
    );
  }
}
