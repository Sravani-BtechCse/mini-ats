import { Candidate, DashboardMetrics, Stage, CandidateNote } from '@/types/ats';
import { INITIAL_CANDIDATES } from './mock-data';
import { STAGES } from './constants';

// In-memory data store on the server, initialized with mock candidates
let candidatesStore: Candidate[] = [...INITIAL_CANDIDATES];

export interface CandidateFilters {
  query?: string;
  stage?: Stage | 'all';
  department?: string;
  role?: string;
  minExperience?: number;
  sortBy?: 'newest' | 'oldest' | 'rating' | 'experience';
}

export const CandidateService = {
  getAll: (filters?: CandidateFilters): Candidate[] => {
    let result = [...candidatesStore];

    if (!filters) return result;

    const { query, stage, department, role, minExperience, sortBy } = filters;

    // Search query (case-insensitive across name, email, role, skills)
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Stage filter
    if (stage && stage !== 'all') {
      result = result.filter((c) => c.stage === stage);
    }

    // Department filter
    if (department && department !== 'all') {
      result = result.filter((c) => c.department === department);
    }

    // Role filter
    if (role && role !== 'all') {
      result = result.filter((c) => c.role === role);
    }

    // Min experience
    if (typeof minExperience === 'number') {
      result = result.filter((c) => c.experienceYears >= minExperience);
    }

    // Sorting
    if (sortBy) {
      if (sortBy === 'newest') {
        result.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
      } else if (sortBy === 'oldest') {
        result.sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime());
      } else if (sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'experience') {
        result.sort((a, b) => b.experienceYears - a.experienceYears);
      }
    } else {
      // Default newest first
      result.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
    }

    return result;
  },

  getById: (id: string): Candidate | undefined => {
    return candidatesStore.find((c) => c.id === id);
  },

  create: (candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'stageHistory' | 'notes'>): Candidate => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: `cand-${Date.now().toString().slice(-4)}`,
      appliedDate: new Date().toISOString(),
      notes: [],
      stageHistory: [
        {
          stage: candidateData.stage || 'applied',
          changedAt: new Date().toISOString(),
          changedBy: 'Recruiter',
          note: 'Candidate profile created',
        },
      ],
    };

    candidatesStore.unshift(newCandidate);
    return newCandidate;
  },

  update: (id: string, updates: Partial<Candidate>, author: string = 'Recruiter'): Candidate | null => {
    const index = candidatesStore.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = candidatesStore[index];
    const hasStageChanged = updates.stage && updates.stage !== current.stage;

    const updatedStageHistory = hasStageChanged
      ? [
          ...current.stageHistory,
          {
            stage: updates.stage as Stage,
            changedAt: new Date().toISOString(),
            changedBy: author,
            note: `Moved to ${updates.stage}`,
          },
        ]
      : current.stageHistory;

    const updatedCandidate: Candidate = {
      ...current,
      ...updates,
      stageHistory: updatedStageHistory,
    };

    candidatesStore[index] = updatedCandidate;
    return updatedCandidate;
  },

  updateStage: (id: string, newStage: Stage, author: string = 'Recruiter', note?: string): Candidate | null => {
    const index = candidatesStore.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = candidatesStore[index];
    if (current.stage === newStage) return current;

    const updated: Candidate = {
      ...current,
      stage: newStage,
      stageHistory: [
        ...current.stageHistory,
        {
          stage: newStage,
          changedAt: new Date().toISOString(),
          changedBy: author,
          note: note || `Stage updated to ${newStage}`,
        },
      ],
    };

    candidatesStore[index] = updated;
    return updated;
  },

  addNote: (candidateId: string, noteText: string, author: string, role: string, rating?: number): Candidate | null => {
    const index = candidatesStore.findIndex((c) => c.id === candidateId);
    if (index === -1) return null;

    const current = candidatesStore[index];
    const newNote: CandidateNote = {
      id: `note-${Date.now()}`,
      author,
      role,
      text: noteText,
      createdAt: new Date().toISOString(),
      rating,
    };

    const updatedCandidate: Candidate = {
      ...current,
      notes: [newNote, ...current.notes],
      rating: rating ? Math.round((current.rating + rating) / 2) : current.rating,
    };

    candidatesStore[index] = updatedCandidate;
    return updatedCandidate;
  },

  delete: (id: string): boolean => {
    const initialLength = candidatesStore.length;
    candidatesStore = candidatesStore.filter((c) => c.id !== id);
    return candidatesStore.length < initialLength;
  },

  resetToDefault: (): Candidate[] => {
    candidatesStore = [...INITIAL_CANDIDATES];
    return candidatesStore;
  },

  getMetrics: (): DashboardMetrics => {
    const total = candidatesStore.length;
    const activeInPipeline = candidatesStore.filter(
      (c) => c.stage === 'applied' || c.stage === 'screening' || c.stage === 'interview'
    ).length;
    const offersExtended = candidatesStore.filter((c) => c.stage === 'offer').length;
    const hiredCount = candidatesStore.filter((c) => c.stage === 'hired').length;
    const rejectedCount = candidatesStore.filter((c) => c.stage === 'rejected').length;

    // Funnel calculations
    const stageCounts: Record<Stage, number> = {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      hired: 0,
      rejected: 0,
    };

    candidatesStore.forEach((c) => {
      if (stageCounts[c.stage] !== undefined) {
        stageCounts[c.stage]++;
      }
    });

    const stageFunnel = STAGES.map((s) => ({
      stage: s.id,
      label: s.label,
      count: stageCounts[s.id] || 0,
      percentage: total > 0 ? Math.round(((stageCounts[s.id] || 0) / total) * 100) : 0,
    }));

    // Role distribution
    const roleCounts: Record<string, number> = {};
    candidatesStore.forEach((c) => {
      roleCounts[c.role] = (roleCounts[c.role] || 0) + 1;
    });

    const roleDistribution = Object.entries(roleCounts)
      .map(([role, count]) => ({
        role,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Top skills aggregation
    const skillCounts: Record<string, number> = {};
    candidatesStore.forEach((c) => {
      c.skills.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Averages
    const avgExperienceYears =
      total > 0
        ? Number((candidatesStore.reduce((acc, c) => acc + c.experienceYears, 0) / total).toFixed(1))
        : 0;

    const avgRating =
      total > 0
        ? Number((candidatesStore.reduce((acc, c) => acc + c.rating, 0) / total).toFixed(1))
        : 0;

    return {
      totalCandidates: total,
      activeInPipeline,
      offersExtended,
      hiredCount,
      rejectedCount,
      stageFunnel,
      roleDistribution,
      topSkills,
      avgExperienceYears,
      avgRating,
      timeToHireDaysEstimate: 14, // Industry standard baseline for early career roles
    };
  },
};
