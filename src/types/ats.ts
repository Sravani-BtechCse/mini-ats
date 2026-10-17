export type Stage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';

export interface CandidateNote {
  id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
  rating?: number; // 1-5
}

export interface StageHistory {
  stage: Stage;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: 'Engineering' | 'Product' | 'Design' | 'Data & AI' | 'Operations';
  stage: Stage;
  experienceYears: number;
  skills: string[];
  rating: number; // 1-5
  appliedDate: string; // ISO date string
  location: string;
  expectedSalary: string;
  currentCompany?: string;
  education?: string;
  resumeUrl?: string;
  resumeSummary: string;
  notes: CandidateNote[];
  stageHistory: StageHistory[];
}

export interface StageConfig {
  id: Stage;
  label: string;
  description: string;
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    accent: string;
  };
}

export interface DashboardMetrics {
  totalCandidates: number;
  activeInPipeline: number;
  offersExtended: number;
  hiredCount: number;
  rejectedCount: number;
  stageFunnel: {
    stage: Stage;
    label: string;
    count: number;
    percentage: number;
  }[];
  roleDistribution: {
    role: string;
    count: number;
    percentage: number;
  }[];
  topSkills: {
    skill: string;
    count: number;
  }[];
  avgExperienceYears: number;
  avgRating: number;
  timeToHireDaysEstimate: number;
}
